/*!
 * jQuery.LiveScroll
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 3/11/2009
 *
 * @projectDescription 
 * http://flesler.blogspot.com/.......
 * @author Ariel Flesler
 * @version 1.0.0
 *
 * @id jQuery.fn.liveScroll
 * @param {Object} settings Hash of settings, it is passed in to jQuery.ScrollTo, none is required.
 * @return {jQuery} Returns the same jQuery object, for chaining.
 *
 * @example $(...).liveScroll();
 **/
;(function( $ ){
	
	var $liveScroll = $.liveScroll = function( settings ){
		$(window).liveScroll( settings );
	};

	// The defaults are public and can be overriden.
	$liveScroll.defaults = {
		step:1
	};

	$.fn.liveScroll = function( settings ){
		settings = $.extend( {}, $liveScroll.defaults, settings );

		return this.each(function(){
			
		});
	};

})( jQuery );