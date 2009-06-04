/*!
 * jQuery.Accessible - Rules engine
 * Copyright (c) 2007-2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 12/27/2007
 *
 * @projectDescription Fixes and advices for more accessible sites.
 * @author Ariel Flesler
 * @version 0.1
 *
 * @id jQuery.accessible
 *
 * @id jQuery.accessible.addRule
 * @param {String} id An identifier for the rule.
 * @param {Bool} defer Should this fix be called on document ready ? (else it's called right away)
 * @param {Function} fn The actual fix (receives jQuery as first argument)
 **/
;(function( $ ){
	
	/**
	 * General links
	 * http://diveintoaccessibility.org/table_of_contents.html
	 * http://www.calstatela.edu/accessibility/manual.htm
	 */
	
	/**
	 * TODO:Relative font-sizes
	 * http://diveintoaccessibility.org/day_26_using_relative_font_sizes.html
	 * http://diveintoaccessibility.org/examples/fontsize.html
	 * http://www.alistapart.com/stories/sizematters/
	 */
	 
	/**
	 * TODO:Skip navigation links
	 * http://www.webaim.org/techniques/skipnav/
	 * http://diveintoaccessibility.org/day_11_skipping_over_navigation_links.html
	 */
	
	$.accessible = function( rules ){
		rules = $.extend( {}, $.accessible.defaults, rules );
		$.each( rules, function( id, run ){
			var rule = $.accessible.rules[id];
			if( rule && run && !rule.done && rule.run ){
				if( rule.defer )
					$.fn.ready(rule.run);
				else
					rule.run();
			}
		});
	};
	
	$.extend( $.accessible, {
		defaults:{//which fixes to run by default
			js_class:true,
			anchors_title:true,
			anchors_has_layout:false,
			no_mouse_rollover:false
		},
		rules: {},
		addRule: function( id, defer, fn ){
			var r = $.accessible.rules;
			r[id] = $.extend( r[id] || {}, {
				done:false,
				defer:defer,
				run:function(){
					r[id].done = true;
					fn( $ );				
				}
			});
		}
	});
	
	var add = $.accessible.addRule;
	
	//adds a css class to allow specialized styling
	add( 'js_class', false, function(){
		$(document.documentElement).addClass('js').removeClass('nojs');
	});
	
	//fixes anchors without title
	add( 'anchors_title', true, function(){
		$('a[title=]').each(function(){
			this.title = $(this).text();
		});
	});

	//TODO: needs more research
	//http://juicystudio.com/article/ie-keyboard-navigation.php
	add( 'anchors_has_layout', true, function(){
		/*$('a[href=]').each(function(){
			this.tabIndex = -1;
		});*/
	});
	
	//TODO: should wisely trigger mouse events on blur and focus.
	add( 'no_mouse_rollover', false, function(){
		/*
		$.event._add = $.event.add;
		$.event.add = function( e, ev ){
			//bind focus/blur parallel to some mouse events ?
		};
		*/
	});

})( jQuery );