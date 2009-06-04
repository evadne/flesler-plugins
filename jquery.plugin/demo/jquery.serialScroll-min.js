/**
 * jQuery.serialScroll - Animated scrolling of series
 * Copyright (c) 2007-2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 3/1/2008
 * @author Ariel Flesler
 * @version 1.1.0
 *
 * http://flesler.blogspot.com/2008/02/jqueryserialscroll.html
 */
;(function($){var a='serialScroll',s=$[a]=function(a){$.scrollTo.window().serialScroll(a)};s.defaults={duration:1e3,axis:'x',event:'click',start:0,step:1,lock:1,cycle:1};$.fn[a]=function(o){o=$.extend({},s.defaults,o);var p=o.event,q=o.step,r=o.duration/q;return this.each(function(){var i=$(this),j=o.lazy?o.items:$(o.items,i),k=o.start,l;if(o.force)n.call(this,{},k);$(o.prev||[]).bind(p,-q,m);$(o.next||[]).bind(p,q,m);i.bind('prev.'+a,-q,m).bind('next.'+a,q,m).bind('goto.'+a,n);if(!o.lazy&&o.jump)j.bind(p,function(e){e.data=j.index(this);n(e,this)});function m(e){e.data+=k;n(e,this)};function n(e,b){if(typeof b=='number'){e.data=b;b=this}var c=e.data,d,f=e.type,g=$(j,i),h=g.length;if(f)e.preventDefault();c%=h;if(c<0)c+=h;d=g[c];if(o.interval){clearTimeout(l);l=setTimeout(function(){i.trigger('next.'+a)},o.interval)}if(isNaN(c)||f&&k==c||o.lock&&i.is(':animated')||!o.cycle&&!g[e.data]||f&&o.onBefore&&o.onBefore.call(b,e,d,i,g,c)===!1)return;if(o.stop)i.queue('fx',[]).stop();o.duration=r*Math.abs(k-c);i.scrollTo(d,o);k=c}})}})(jQuery);