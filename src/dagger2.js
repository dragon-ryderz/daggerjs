var Dagger;

(function() {
	Dagger = function(selector) {
		return Dagger.NodeList(selector);
	};
	
	// Expose Dagger to the appropriate object -- `module.exports` in node.js or `window` in a browser
	if (typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = Dagger;
	} else {
		this.Dagger = this.dg = Dagger;
	}
	
	Dagger._version = 0.2;
	
}).call(this);



/**
 * DaggerJS - Dagger.ready - Intelligent handling for the ready state of the document
 */
(function() {
	var _readyAlready = document.readyState === 'complete';
	var _readyCallbacks = [];
	
	var _handleReady = function() {
		if (document.readyState === 'interactive' || _readyAlready) {
			_readyAlready = true;
			while (_readyCallbacks.length) {
				var nextCallback = _readyCallbacks.shift();
				nextCallback[0](nextCallback[1]);
			}
		}
	};
	document.onreadystatechange = _handleReady;
	
	// Exposed method
	Dagger.ready = function(callback, context) {
		_readyAlready ? callback(context) : _readyCallbacks.push([callback, context]);
	};
})();



/**
 * DaggerJS - Public helper and identifier functions
 */

// Declare the extend function first so we can use it to add the others
Dagger.extend = function(sourceObj, targetObj) {
	if (!targetObj) return sourceObj;
	
	for (var key in targetObj) {
		sourceObj[key] = targetObj[key];
	}
	return sourceObj;
};

Dagger.extend(Dagger, {
	arraysMatch: function(arr1, arr2) {
		if (arr1.length !== arr2.length) return false;
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i] !== arr2[i]) return false;
		}
		return true;
	},
	objectsMatch: function(obj1, obj2) {
		return typeof obj1 === 'object'
				&& typeof obj2 === 'object'
				&& Dagger.arraysMatch(Object.keys(obj1), Object.keys(obj2));
	},

	each: function(obj, callback, context) {
		if (Dagger.isObject(obj)) {
			var keys = Object.keys(obj);
			for (var i = 0; i < keys.length; i++) {
				callback.call(context, obj[keys[i]], keys[i], i, obj); // callback(val, key, index, obj)
			}
		} else if (Dagger.isArray(obj)) {
			for (var i = 0; i < obj.length; i++) {
				callback.call(context, obj[i], i, obj); // callback(val, index, arr)
			}
		} // No Ret
	},
	keys: function(obj) {
		return Object.keys(obj); // Ret Type === Array
	},
	map: function(obj, callback, context) {
		var result = [];
		Dagger.each(obj, function(key, val, index, obj2) {
			result.push(callback.call(context, key, val, index, obj2));
		});
		return result; // Ret Type === Array
	},
	padLeft: function(str, padChars, padLength) {
		return (new Array(padLength + 1).join(padChars) + str).slice(-padLength);
	},
	unique: function(arr) {
		return arr.reduce(function(mem, item) {
			return mem.indexOf(item) > -1 ? mem : mem.concat(item);
		}, []);
	},
	values: function(obj) {
		return Object.keys(obj).map(function(key) { return obj[key]; }); // Ret Type === Array
	},


	isArray: function(arr) {
		return Array.isArray(arr);
	},
	isDeferral: function(obj) {
		return typeof obj === 'object' && Dagger.objectsMatch(Object.getPrototypeOf(obj), Dagger.Deferral.prototype);
	},
	isEl: function(obj) {
		return typeof obj === 'object' && Dagger.objectsMatch(Object.getPrototypeOf(obj), Dagger.El.prototype);
	},
	isObject: function(obj) {
		return typeof obj === 'object' && !Dagger.isArray(obj);
	},
	isXMLHttpRequest: function(obj) {
		return obj instanceof XMLHttpRequest;
	}
});



/**
 * DaggerJS - Dagger.require - Easily load script dependencies
 */
 (function() {
 	// Exposed Method
 	Dagger.require = function(dependencies, callback) {
 		Dagger.isArray(dependencies) || (dependencies = [dependencies]);
 		for (var i = 0; i < dependencies.length; i++) {
 			
 			var newScript = document.createElement('script');
 			newScript.src = dependencies[i] + '.js';
 			document.head.appendChild(newScript);
 			
 			newScript.onload = function(event) {
 				console.log(this, event, 'here!');
 			};
 		}
 	};
 })();



/**
 * DaggerJS - Dagger.date - Intelligent date formatting
 */
(function() {
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	var _date = '';
	
	// Used to grab digit groupings from the user's date
	var _getNextDigits = function() {
		var nextDigit = (_date.match(/\d/) || [])[0];
		var index = _date.indexOf(nextDigit);
		
		if (/\d/.test(_date[index + 1])) {
			var twoDigits = nextDigit + _date[index + 1];
			_date = _date.replace(/\d\d/, '');
			return twoDigits;
		}
		_date = _date.replace(/\d/, '');
		return nextDigit;
	}
	
	// Turn the user's date into a JavaScript Date object.
	var _parseDate = function(date) {
		if (!isNaN(+date)) return new Date(+date);
		_date = date;
		
		var year = (date.match(/\d{4}/) || [])[0];
		_date = _date.replace(/\d{4}/, '');
		if (!year) {
			year = new Date().getFullYear();
		}
		
		var month = -1;
		dg.each(months, function(nextMonth, index) {
			if (date.match(new RegExp(nextMonth.slice(0, 3), 'i'))) month = index;
		});
		if (month === -1) {
			month = _getNextDigits();
			if (!month) month = 0;
			else month = +month - 1;
		}
		
		var day = _getNextDigits();
		if (!day) return new Date(year, month);
		
		var hour = _getNextDigits();
		if (!hour) return new Date(year, month, day);
		
		var minute = _getNextDigits();
		if (!minute) return new Date(year, month, day, hour);
		
		var second = _getNextDigits();
		if (!second) return new Date(year, month, day, hour, minute);
		
		return new Date(year, month, day, hour, minute, second);
	};
	
	// Return the date in the user's specified format.
	var _formatDate = function(date, format) {
		return format.toUpperCase().replace('YYYY', date.getFullYear())
				.replace('YY', date.getFullYear().toString().slice(-2))
				.replace('DD', Dagger.padLeft(date.getDate(), '0', 2))
				.replace('D', date.getDate())
				.replace('MMMM', months[date.getMonth()])
				.replace('MMM', shortMonths[date.getMonth()])
				.replace('MM', Dagger.padLeft(date.getMonth() + 1, '0', 2))
				.replace('M', date.getMonth() + 1);
	};
	
	// Exposed method
	Dagger.date = function(dateIn, format) {
		var date = _parseDate(dateIn);
		return format ? _formatDate(date, format) : date;
	}
})();
