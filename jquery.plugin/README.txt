jQuery.Plugin 1.0, by Ariel Flesler

To register a plugin:

var plugin = $.plugin.register( url_of_the_file, names_to_register, settings ); 
or
var plugin = new $.plugin( url_of_the_file, names_to_register, settings ); 

names_to_register is a hash in this form:
{
	$:'foo',
	fn:['foo','bar']
}

That means the plugin will register(once loaded): $.foo, $.fn.foo and $.fn.bar.
For now, you can only register to those 2 namespaces. You can use 1 string or an array of names.

settings is an optional hash with these options:
{
		cache:true/false, //use false to add jquery trick to avoid caching
		id:'some_name', //an id for the script, only necessary if another requires it
		require:[ 'some_name', 'some_other_name' ], //ids of the plugins required to be loaded before this
		sync:false/true //whether it must be asked synchronously, false by default, necessary if the call modifies the 'this'
}

Once a call to the plugin is done, the plugin will be loaded, that call will be taken into account and you can
even use chaining with this fake call. so $('a').foo().bar() will work perfectly.

The plugin objects have methods( queue, add, check, load, preload, etc ) will explain them soon(sorry).
One useful data stored in the object is plugin.url, which contains the src of the plugin.

You can use bind/unbind/trigger on the plugin objects, and $.plugin itself for global calls.
When a plugin starts loading, the event 'loading' is triggered, it receives the plugin object as 2nd argument.
When finally loaded, the event 'loaded' is triggered. 


Known issues:
  -Remote scripts cannot be sync (jQuery limitation).
  -Mixing remote and local plugins in a chain seems to cause problems sometimes.
  