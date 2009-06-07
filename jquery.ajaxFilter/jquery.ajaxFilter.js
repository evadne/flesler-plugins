/*!
 * jQuery.AjaxFilter
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 06/07/2009
 *
 * @projectDescription Registry of filters for AJAX responses.
 *
 * @author Ariel Flesler
 * @version 1.1.0
 */
;(function( $ ){
	
	var registry = { };

	$.ajaxFilter = {
		// Expose it just in case
		filters : registry,
		// types can be any of script, json, xml, html
		// or many separated by spaces
		register:function( name, types, fn ){
			$.each( types.split(' '), function( i, type ){
				if( !registry[type] )
					registry[type] = {};
				registry[type][name] = fn;
			});
		},
		// This could be used without the need of an ajax request
		run:function run(type, filter, data){
			var filter = registry[type] && registry[type][ filter ];

			// The 'this' of the function will be the settings object
			return filter && typeof data === 'string'? filter.call( this, data, type ) : data;
		}
	};
	
	// This handler is used instead, don't override it
	$.ajaxSettings.dataFilter = function( data, type ){
		if (this.filter == '*')
			for( var filter in registry[type] )
				data = $.ajaxFilter.run( type, filter, data )
		else
			data = $.ajaxFilter.run( type, this.filter, data );
		return data;
	};
	
})( jQuery );