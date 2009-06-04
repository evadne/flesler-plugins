jQuery.ajaxFilter 1.0

This tiny plugin provides a registry for different filter functions to sanitize ajax responses.
It requires jQuery 1.3 with its new feature, the 'dataFilter' ajax setting.

If you want to provide a new implementation, you need to do something like this:

jQuery.ajaxFilter.register( 'js_in_href', 'html', function( data ){
	return data.replace(/href="javascript:[^"]+"/g, '');
});

or

jQuery.ajaxFilter.register('eval', 'script html json', function( data ){
	return data.replace(/eval\(.+?\);?/g, '');
});

Arguments for register() are:
1- Name for the filter, used as 'filter' when calling jQuery.ajax.
2- One or more dataTypes to handle. Can be any combination of ajax, html, json and xml separated by spaces.
3- The filter function. Will receive 2 arguments: the data and the type. The 'this' will reference the settings object.

To use it, you do:

jQuery.ajax({
	url:'foo.html',
	filter:'js_in_href',
	// ...
});

The filter can also parse the response.
That means it can (for example) provide an alternative way of eval'ing json. This is specially useful for Adobe AIR apps.
If the filter returns something else than a string, it's assumed to be the final response.