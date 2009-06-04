/*!
 * jQuery.Tasks
 * Copyright (c) 2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 4/15/2009
 *
 * @projectDescription Task-oriented programming
 *
 * @author Ariel Flesler
 * @version 1.0
 */
;(function( $ ){
	
	moveTasksTo($);
	
	// Tween
	
	$.Tween = $.Task.extend(function( context, prop, speed, easing ){
		var self = this;
		
		self.base(arguments);

		self.context = context;
		self.prop = prop;
		
		self.opts = jQuery.speed(speed,easing);
		self.opts.queue = false;
		
		self._complete = function(){
			self.complete();
		};
	}, {
		start: function(){
			this.base(arguments);
			this.opts.complete = this._complete;
			$(this.context).animate(this.prop,this.opts);
		},
		dispose:function(){
			this.base(arguments);
			this._complete = null;
		}
	});
	
	$.tween = function( c, p, s, e ){
		return new $.Tween( c, p, s, e );
	};
	
})( jQuery );