/*!
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 11/16/2007
 * @author Ariel Flesler
 * @version 1.2.4
 * Compatible with jQuery 1.2.1, tested on Firefox 2.0.0.7, and IE 6, both on Windows.
 **/
;(function($){$.scrollTo=function(a,b){return $('html,body').scrollTo(a,b)};$.scrollTo.defaults={axis:'y',speed:1};$.fn.scrollTo=function(d,e){e=$.extend({},$.scrollTo.defaults,e);e.queue=e.queue&&e.axis.length==2;if(e.queue)e.speed=Math.ceil(e.speed/2);if(typeof e.offset=='number')e.offset={left:e.offset,top:e.offset};return this.each(function(){var c=$(this),t=d,q,r={};switch(typeof t){case'number':case'string':if(/^([+-]=)?\d+(px)?$/.test(t)){t={top:t,left:t};break}t=$(t,this);case'object':if(t.is||t.style)q=(t=$(t)).offset()}$.each(e.axis.split(''),parse);animate(e.onAfter);function parse(i,b){var P=b=='x'?'Left':'Top',p=P.toLowerCase(),k='scroll'+P,a=c[0][k];r[k]=q?q[p]+(c.is('html,body')?0:a-c.offset()[p]):t[p];if(e.margin&&t.css)r[k]-=parseInt(t.css('margin'+P))||0;if(e.offset&&e.offset[p])r[k]+=e.offset[p];if(!i&&e.queue){if(a!=r[k])animate(e.onAfterFirst);delete r[k]}};function animate(a){c.animate(r,e.speed,e.easing,function(){if(a)a.call(this,c,r,t)})}})}})(jQuery);