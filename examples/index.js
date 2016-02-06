z.ready(function() {
	var obj = {
		one: {
			one: 1,
			two: 2
		},
		two: {
			one: 11,
			two: 22
		},
		three: {
			one: 111,
			two: 222
		},
		four: {
			one: 1111,
			two: 2222
		}
	}
	var obj2 = {
		one: {
			one: 7,
			two: 3
		},
		two: {
			one: 13,
			three: 'stuff'
		}
	}
	var obj3 = {a: 1, b: 2};
	var obj4 = {a: 5, c: 'c'};
	
	console.log(z.extend(obj3, obj4), obj3, obj4)
	console.log(z.extend(obj, obj2, true), obj, obj2)
});
