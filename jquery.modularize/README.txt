jQuery.Modularize 1.0

This small plugin(673 bytes!) enables the use of modular methods for jQuery.
It allows the developer to apply the module pattern, to the methods of jQuery.fn.
Using them as namespaces or modules for more functions.

This helps mantaining the rule of only claiming one name from the jQuery namespace.

It takes a function in this way:

*  $.fn.foo = function(){ ... };

*  $.fn.foo.bar = function(){ ... };

*  $.fn.foo.baz = function(){ ... };

And enables you to use it like this:

*  $(...).foo().bar( ... );

*  $(...).foo( .... );

*  $(...).foo().baz( ... ).foo().bar( ... ).foo( ... );

As showed above, the method that acts as module, can also be used as function.
To avoid using it as module, the function must receive arguments.

The plugin can be called in some different ways:

1- $.modularize( 'foo' ); 

   If $.fn.foo did exist, it will be used when $(...).foo( ... ) is called with arguments.
   If $(...).foo won't be used as function, then you don't need to declare it, just call the plugin.
	
2- $.modularize( 'foo', function(){ ... } );

   The given function will be used when $(...).foo( ... ) is called with arguments.
   This is a shortcut for declaring it, and then calling the plugin.
   
3- $.modularize( 'baz', null, $.fn.foo );

   This allows: $(...).foo().baz().foobar( ... ), instead of null, you could send the default function.
   To do this, make sure you created $.fn.foo.
   
The 'this' (scope) of the methods, will always be the matched elements, $(...).
The methods will be gathered on the first call to the function. Thus, you can call the plugin before adding
the methods to the module, or after, it doesn't matter.

If you need to call the module and then add methods, or you just want the methods to be gathered each time,
set $.fn.foo.lazy = true; You can set this to true, call the methods, and then reset to false.