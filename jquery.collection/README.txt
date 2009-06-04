jQuery.Collection 1.0 - by Ariel Flesler

This plugin generates collection classes, that work almost exactly as jQuery does. 
These collections include all those jQuery functions, that are used to manipulate the collection itself.

The supported functions( yourCollection.fn ) are:
	add, andSelf, attr, each, end, eq, extend,	filter, get, include, index, init, is, map, not, pushStack,	setArray, size and slice.

Notes:
	-The name 'someClass' will be used to refer to any collection class, included $.collection.
 	-When 'xxx.fn' is said, it means 'xxx.prototype'. Like with jQuery, 'fn' is a shortcut for its prototype, which is an associative array.
	 Adding functions and other data to someClass.fn will automatically add this data to future instances of this class.
	 So if you do: someClass.fn.foo = function(){ alert(this); }
	 Then someClass(...).foo() will call that function and alert the result of someClass(...).

Methods that need some kind of explanation:
	someClass.fn.init():
		This function should be (likely) modified for each collection. Like $.fn, it parses the arguments received by the constructor. 
	  	It will probably have a: return this.setArray([array_of_parsed_elements]); in the end.
	someClass.include(), someClass.fn.include():
		Similar to $.extend(), it will copy the listed attributes/methods from source to target.
		The methods are specified with their name, as array or comma separated string of names.
		If target is not specified, then target is the element from where you called the function ( target.include... )
		The function accepts a parsing function that gets the arguments [ method, methodName, source ] and returns the final method.
		In short, the call to include() would be like this: something.include([ target,] source, methods[, parse ]).
	someClass.build():
		This method will create a new collection class, that inherits from the caller(someClass in this case)
		$.collection is a class by itself. All collection classes will inherit from it, or its subclasses.
	someClass.fn.filter():
		This works like $.fn.filter. It accepts:
 			-A function that returns true/false.
 			-Any other thing will be compared literally. The filter can be an array of elements.
 			 Only the those items that are included in the filter remain.
 	someClass.fn.not():
 		Works exactly like filter(), but keeps those items that didn't pass the filter.
 	someClass.fn.is():
 		Uses filter() internally so it accepts the same kind of filter. Will return true if at least 1 element passes the filter.
 	someClass.implement():
 		This function is similar to include. It will add all the given methods, from the given source, to the .fn of the calling class.
 		When calling an implemented function, it will map EACH matched element, using this function and the received arguments.
 		I'll show a clear example:
 			$.collection.implement( String.prototype, 'replace' );
 			$.collection('axc','x','txq').replace('x','b') -results in-> [ 'abc', 'b', 'tbq' ]
 		The modifications made by the function, can be reverted by calling .end(), just like with jQuery.

To see some examples, you can check the project page, if you haven't yet. At: http://plugins.jquery.com/project/Collection
If you have any doubt, you can mail me to aflesler(at)gmail(dot)com. Or make a post at http://flesler.blogspot.com