/*!
 * jQuery.Broadcast
 * Copyright (c) 2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 8/7/2008
 *
 * @projectDescription Broadcasting ability for jQuery methods
 *
 * @author Ariel Flesler
 * @version 0.9.1
 */
;(function( $ ){

	var done = {},
		before = {};
		
	$.broadcast = function( method ){
		if( done[method] ) return;
		done[method] = true;
		
		var old = $.fn[method],
			args;

		$.fn[method] = function(){
			// Save them once for each call
			args = arguments;

			if( !before[method] )
				// Faster approach when before is not needed
				return run( this );

			// FIXME ? adds new stack entries that the user won't expect
			return this.map(function(){
				// TODO: Allow the handlers to change the arguments
				// Put the as e.args
				var e = $.Event('before-'+method);
				$.event.trigger( e, args, this );

				return e.isDefaultPrevented() ? this : $.makeArray(
					run($(this))
				);
			});				
		};

		function run( obj ){
			var ret = old.apply( obj, args );
			obj.trigger( method, args );
			return ret;
		}
	};
	
	$.broadcast.prepare = function( name ){
		$.event.special[name] = {
			setup:function(){
				$.broadcast( name );
			},
			teardown:function(){}
		};
		$.event.special['before-'+name] = {
			setup:function(){
				before[name] = true;
				$.broadcast( name );
			},
			teardown:function(){}
		};
	};
	
	$.broadcast.start = function(){
		for( var name in $.fn ){
			var method = $.fn[name];
			// Skip non-functions, real events and ajax events

			if( name != 'trigger' && name != 'ready' &&
				$.isFunction(method) &&
				(method+'').indexOf('this.bind(') == -1 )

				$.broadcast.prepare(name);
		}
	};
	
	$.broadcast.start();
	
})( jQuery );