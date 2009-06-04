jQuery.XHR 1.0

This tiny plugin provides a registry for different xhr implementations to co-exist.
It requires jQuery 1.3 with its new feature, the 'xhr' ajax setting.

If you want to provide a new implementation, you need to do this:

jQuery.xhr.register( 'my_xhr', function( settings ){
	return new MyXhrImplementation( settings );
});

The argument settings is the settings object used by jQuery.ajax.

To use it, you do:

jQuery.ajax({
	// ...
	url:'...',
	transport:'my_xhr',
	// ...
});

The default implementation is used by default (unless it's overriden with ajaxSetup) and it's called 'xhr'.