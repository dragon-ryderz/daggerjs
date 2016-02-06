(function() {
	// = = = = = = = =   Zeus Core   = = = = = = = = //
	var Zeus = function() {
		
	};
	
	// Expose Zeus to the appropriate object -- `module.exports` in node.js or `window` in a browser
	if (typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = zeus;
	} else {
		this.Zeus = this.z = zeus;
	}
	Zeus._version = 0.1;
	
	
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
		Zeus.prototype.ready = function(callback, context) {
			_readyNow ? callback.call(context) : _readyCallbacks.push(callback.bind(context));
		};
	})();
	
	
	/**
	 * ZeusJS - Some core methods
	 */
	(function() {
		Zeus.prototype.argsArray = function(args, offset) { return Array.prototype.slice.call(args, offset || 0); };
		Zeus.prototype.isArr = function(arr) { return Array.isArray(arr); };
		Zeus.prototype.isObj = function(obj) { return typeof obj === 'object' && !zeus.isArr(obj); };
	})();
	
	
	/**
	 * ZeusJS - Zeus.extend - Insert the properties of one or multiple objects into destObj
	 */
	(function() {
		var copyProps = function(destObj, injectionObj, deepCopy) {
			Object.keys(injectionObj).forEach(function(key) {
				zeus.isObj(destObj[key]) && zeus.isObj(injectionObj[key]) && deepCopy 
					? copyProps(destObj[key], injectionObj[key], deepCopy)
					: destObj[key] = injectionObj[key];
			});
			return destObj;
		};
		
		Zeus.prototype.extend = function(destObj) {
			var args = zeus.argsArray(arguments, 1),
				deepCopy = (typeof args[args.length - 1] === 'boolean' ? args.pop() : false);
			
			for (var i = 0; i < args.length; i++) {
				copyProps(destObj, args[i], deepCopy)
			}
			return destObj;
		};
	})();
	
}).call(this);
