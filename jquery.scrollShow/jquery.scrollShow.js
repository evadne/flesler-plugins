/*!
 * jQuery.ScrollShow - Scrolling Slideshow.
 * Copyright (c) 2007-2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 10/30/2007
 * @author Ariel Flesler
 * @version 0.8
 *
 * @id jQuery.fn.scrollShow
 * @param {Object} settings Hash of settings (detailed below).
 * @return {jQuery} Returns the same jQuery object, for chaining.
 **/
;(function( $ ){
	
	$.scrollShow = {
		defaults: {
			elements:'img',//elements selector (relative to view)
			itemSize:{
				height:200,
				width:200
			},
			view:null,//container of the elements, the one to fix the width.
			navigators:null,//selector to the elements to navigate the slideshow (must be an array of more than 1 navigationMode is used).
			navigationMode:'s',//sequential, random, localscroll
			speed:600,//speed of transition, 1 for no-animation
			wrappers:'simple',//simple,resize,crop,link
			circular:false,//should the slideshow rewind/advance on the extremes ?.
			easing:'linear',//easing equation
			axis:'x',//axes to animate
			margin:true,//take margin in account?
			start:null, //force the scroll to start at some position.
			setWidth:false//whether to calculate and set, the overall width of the slideshow.
		}
	};
	
	function wrap( $els, type, size ){//wrap the photos with several different wrappers.
		switch( type ){
			case 'crop': $els = $els.wrap('<div class="jq-ss-crop">').parent().css('overflow','hidden');					
			case 'resize': return $els.css( size );
			case 'simple': return $els.wrap('<div class="jq-ss-simple">').parent();
			case 'anchor':
				return $els.wrap('<a class="jq-ss-anchor">').parent().each(function(){
					this.href = '#' + this.firstChild.id;
				});
			case 'link': 
				if( $els.is('img') )
					return $els.wrap('<a target="_blank" class="jq-ss-link">').parent().each(function(){
						this.href = this.firstChild.src;
					});
			default: return $els;					
		}
	};
	
	$.fn.scrollShow = function( settings ){
		settings = $.extend( {}, $.scrollShow.defaults, settings );
		
		return this.each(function(){
			var 
				widget	  = this,
				$view	  = settings.view ? $(settings.view, this) : this,
				$elements = $(settings.elements, $view),
				limit	  = $elements.length,
				active	  = 0;
			
			$.each( settings.wrappers.split(/\s*,\s*/), function( i, wrapper ){
				$elements = wrap( $elements, wrapper, settings.itemSize );													 
			});			
			$elements.css( settings.itemSize );//ensure the outer elements have fixed size.
			
			if( !settings.navigators ){//this shouldn't get to happen
				settings.navigators = '';
				settings.navigationMode = 'r';
			}
			
			if( settings.navigators.constructor != Array )
				settings.navigators = [settings.navigators];
			
			$.each( settings.navigationMode.split(''), function( i, type ){
				switch( type ){
					case 's'://sequential navigation
						$(settings.navigators[i],widget)
							.eq(0).bind('click', { dir: -1 }, sequential ).end()
							.eq(1).bind('click', { dir: +1 }, sequential );
					break;
					case 'r'://random navigation
						var $nav = $(settings.navigators[i] || $elements, widget),
							ratio = $nav.length && $elements.length / $nav.length;
						if( ratio )
							$nav.each(function( pos ){
								$(this).bind( 'click', { pos: Math.floor(ratio*pos) }, random );												  
							});
					break;
					case 'l':
						if( $.fn.localScroll )
							$(settings.navigators[i], widget).localScroll( settings );
					break;

				}
			});				

			(function( $e, w ){					  
				var imgw = ($e.width() + attrs('margin') + attrs('padding') + attr('border'));
				
				do w -= imgw;
				while( w > 0 && limit-- );//find the last element we can scroll To.
				
				if( !settings.setWidth ) return;
				
				do{
					$e = $e.parent();
					if( $e[0] == $view[0] )
						return;
				}while( $e.length > 1 );
				$e.width( imgw * $elements.length  );//if there's a container for the elements, calculate it's width.
				
			})( $elements, $view.width() );

			if( settings.start != null )
				random( settings.start );
			
			function attrs( name ){
				return attr(name+'Left') + attr(name+'Right');
			};
			function attr( name ){
				return parseInt($elements.css(name)) || 0;	
			};
			
			function sequential( event ){
				return random.call( this, active + event.data.dir );
			};
			
			function random( event ){
				var pos = event.data ? event.data.pos : event;
				if( pos < 0 )
					pos = active == 0 && settings.circular ? limit : 0;
				else if( pos > limit )
					pos = active == limit && settings.circular ? 0 : limit;
	
				$view.stop().scrollTo( $elements[pos], settings );
				active = pos;
				if( this.blur )
					this.blur();
				return false;
			};				
		});
	};
		  
})( jQuery );