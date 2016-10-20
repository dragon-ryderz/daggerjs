(function() {
	// = = = = = = = =   Zeus Core   = = = = = = = = //
	var Zeus = function() {
		if (_constructor) return _constructor.apply(this, arguments);
	};
	var _constructor;
	
	// Expose Zeus to the appropriate object -- `module.exports` in node.js or `window` in a browser
	if (typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = Zeus;
	} else {
		this.Zeus = this.z = Zeus;
	}
	Zeus._version = '0.0.0';
	
	
	/**
	 * ZeusJS - Zeus.ready - Intelligent handling for the ready state of the document
	 */
	(function() {
		var _readyNow = document.readyState === 'complete' || document.readyState === 'interactive',
			_readyCallbacks = [];
		
		document.onreadystatechange = function() {
			if (document.readyState !== 'interactive') return;
			
			_readyNow = true;
			while (_readyCallbacks.length) _readyCallbacks.shift()();
		};
		
		// Exposed method
		Zeus.ready = function(callback, context) {
			_readyNow ? callback.call(context) : _readyCallbacks.push(callback.bind(context));
		};
	})();
	
	
	/**
	 * ZeusJS - Some core methods
	 */
	(function() {
		Zeus.argsArray = function(args, offset) { return Array.prototype.slice.call(args, offset || 0); };
		Zeus.isArr = Array.isArray;
		Zeus.isObj = function(obj) { return typeof obj === 'object' && !Zeus.isArr(obj); };
	})();
	
	
	/**
	 * ZeusJS - Zeus.extend - Insert the properties of one or multiple objects into the destination object
	 */
	(function() {
		var copyProps = function(destObj, injectionObj, deepCopy) {
			Object.keys(injectionObj).forEach(function(key) {
				Zeus.isObj(destObj[key]) && Zeus.isObj(injectionObj[key]) && deepCopy
					? copyProps(destObj[key], injectionObj[key], deepCopy)
					: destObj[key] = injectionObj[key];
			});
			return destObj;
		};
		
		Zeus.extend = function(destObj) {
			var args = Zeus.argsArray(arguments, 1),
				deepCopy = (typeof args[args.length - 1] === 'boolean' ? args.pop() : false);
			
			for (var i = 0; i < args.length; i++) {
				copyProps(destObj, args[i], deepCopy)
			}
			return destObj;
		};
	})();
	
	
	/**
	 * ZeusJS - Zeus.NodeList - Advanced DOM selection and manipulation
	 */
	(function() {
		var query = function(selector, context) {
			context || (context = document);
			return context.querySelectorAll(selector);
		};
		
		var NodeList = function(selection) {
			if (typeof selection === 'string') selection = query(selection);
			if (!selection) return this;
			
			for (var i = 0; i < selection.length; i++) this.push(selection[i]);
			return this;
		};
		NodeList.prototype = {
			css: function(key, val) {
				if (Zeus.isObj(key)) for (var prop in key) this.css(prop, key[prop]);
				if (typeof key === 'undefined') return this[0].style;
				if (typeof val === 'undefined') return this[0].style[key] || window.getComputedStyle(this[0])[key];
				
				_loop.call(this, function() {
					this.style[key] = val;
				});
				return this;
			},
			inAfter: function(node) {
				node = _toNodeList(node)[0];
				_reverseLoop.call(this, function() {
					node.parentElement.insertBefore(this, node.nextElementSibling);
				});
				return this;
			},
			inBefore: function(node) {
				node = _toNodeList(node)[0];
				_loop.call(this, function() {
					node.parentElement.insertBefore(this, node);
				});
				return this;
			},
			inFirst: function(node) {
				node = _toNodeList(node)[0];
				_reverseLoop.call(this, function() {
					node.insertBefore(this, node.firstChild);
				});
				return this;
			},
			inLast: function(node) {
				node = _toNodeList(node)[0];
				_loop.call(this, function() {
					node.appendChild(this);
				});
				return this;
			},
			putAfter: function(node) { return _toNodeList(node).inAfter(this); },
			putBefore: function(node) { return _toNodeList(node).inBefore(this); },
			putFirst: function(node) { return _toNodeList(node).inFirst(this); },
			putLast: function(node) { return _toNodeList(node).inLast(this); },
			out: function() {
				_loop.call(this, function() {
					this.parentElement.removeChild(this);
				});
				return this;
			},
			
			first: function() { return _toNodeList(this[0]); },
			last: function() { return _toNodeList(this[this.length - 1]); },
			index: function(i) { return _toNodeList(this[i]); },
			
			parent: function() { return _toNodeList(this[0].parentNode); },
			parents: function(selector) {
				if (selector) return _findParent.call(this, selector);
				var nodes = new NodeList(),
					currentNode = this[0];
				
				while (currentNode.parentNode !== document) {
					nodes.push(currentNode.parentNode);
					currentNode = currentNode.parentNode;
				}
				return nodes;
			},
			
			// These properties make the object behave like an array:
			length: 0,
			splice: Array.prototype.splice
		};
		// Give ourselves (and users) access to all array methods
		Object.setPrototypeOf(NodeList.prototype, Array.prototype);
		
		var _loop = function(callback) {
			for (var i = 0; i < this.length; i++) callback.call(this[i]);
		};
		var _reverseLoop = function(callback) {
			for (var i = this.length - 1; i >= 0; i--) callback.call(this[i]);
		};
		var _toNodeList = function(node) {
			if (_isNodeList(node)) return node;
			return new NodeList(node instanceof Node ? [node] : node);
		};
		var _isNodeList = function(node) {
			return Zeus.isObj(node) && node instanceof NodeList;
		};
		
		var _findParent = function(selector) {
			var nodes = new NodeList();
			_loop.call(this, function() {
				var currentNode = this;
				while (currentNode.parentNode !== null) {
					if (_matchesSelector.call(currentNode.parentNode, selector)) nodes.push(currentNode.parentNode);
					currentNode = currentNode.parentNode;
				}
			});
			return nodes;
		};
		
		var _matchesSelector = function(selector) {
			var node = this;
			console.log(node);
			return true;
		};
		
		_constructor = function(selector) {
			return _toNodeList(selector);
		};
	})();
	
}).call(this);
