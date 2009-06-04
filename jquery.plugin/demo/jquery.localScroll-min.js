/**
 * jQuery.LocalScroll - Animated scrolling navigation, using anchors.
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com
 * Licensed under GPL license (http://www.opensource.org/licenses/gpl-license.php).
 * Date: 2/3/2008
 * @author Ariel Flesler
 * @version 1.2.3
 **/
;(function($){var g=location.href.replace(/#.*/,''),a=$.localScroll=function(a){$('body').localScroll(a)};a.defaults={duration:1e3,axis:'y',event:'click',stop:true};a.hash=function(b){b=$.extend({},a.defaults,b);b.hash=false;if(location.hash)setTimeout(function(){scroll(0,location,b)},0)};$.fn.localScroll=function(b){b=$.extend({},a.defaults,b);return(b.persistent||b.lazy)?this.bind(b.event,function(e){var a=e.target;a=$([a,a.parentNode]).filter(filter)[0];a&&scroll(e,a,b)}):this.find('a').filter(filter).bind(b.event,function(e){scroll(e,this,b)}).end().end();function filter(){var c=this;return!!c.href&&!!c.hash&&c.href.replace(c.hash,'')==g&&(!b.filter||$(c).is(b.filter))}};function scroll(e,a,c){var d=a.hash.slice(1),b=document.getElementById(d)||document.getElementsByName(d)[0];if(b){e&&e.preventDefault();var f=$(c.target||$.scrollTo.window());if(c.lock&&f.is(':animated'))return;if(c.onBefore)c.onBefore.call(a,e,b,f);if(c.stop)f.queue('fx',[]).stop();f.scrollTo(b,c);if(c.hash)f.queue(function(){location=a.hash})}}})(jQuery);