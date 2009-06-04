/*!
 * jQuery.AjaxFilter
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 8/7/2008
 *
 * @projectDescription Registry of filters for AJAX responses.
 *
 * @author Ariel Flesler
 * @version 1.0.1
 */
;(function( $ ){
	
	var filters = { };

	$.ajaxFilter = {
		// Expose it just in case
		f : filters,
		// types can be any of script, json, xml, html
		// or many separated by spaces
		register:function( name, types, fn ){
			$.each( types.split(' '), function( i, type ){
				if( !filters[type] )
					filters[type] = {};
				filters[type][name] = fn;
			});
		}
	};
	
	// This handler is used instead, don't override it
	$.ajaxSettings.dataFilter = function( data, type ){
		var filter = filters[type] && filters[type][ this.filter ];

		// The 'this' of the function will be the settings object
		return filter ? filter.call( this, data, type ) : data;
	};
	
})( jQuery );