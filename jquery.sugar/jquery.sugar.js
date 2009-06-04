/*!
 * jQuery.Sugar
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 8/7/2008
 *
 * @projectDescription Easy manipulation of asynchronous calls to jQuery methods.
 *
 * @author Ariel Flesler
 * @version 0.9.0b
 */
;(function( $ ){
	
	/* QUEUER */
	
	function imitate(){
		for( var key in $.fn ){
			qp[key] = qp[key] || ( !$.isFunction($.fn[key]) ? $.fn[key] : (function(key){
				return function(){
					this._queue.push({ m:key, a:arguments });
					return this;
				};
			})(key) );
		}
	};
	
	function Queuer( parent ){
		if( !qp.jquery )
			imitate();
		this._parent = parent;
		this._queue = [];
	}
	
	var qp = Queuer.prototype;
	
	qp.done = qp.meanwhile = function(){
		return this._parent;
	};
	
	qp.then = function(){
		return this._child = new Queuer(this);
	};
	
	qp._run = function( context ){
		var i = 0, token;
		context = $(context);
		while( token = this._queue[i++] )
			context = context[token.m].apply( context, token.a );
		
		if( this._child )
			this._child._prepare( context );
	};
	
	qp._prepare = function( $elems ){
		var queuer = this;
		$elems.each(function(){
			var $self = $(this),
				queue = $self.activeQueue();

			if( queue )
				$self.queue( queue, function(){
					$self.activeQueue('');
					queuer._run(this);
					
					// Recently modified
					if( queue == 'fx' )
						$self.dequeue();
				});
		});
	};
	
	/* jQuery method */
	
	$.fn.then = function(){
		var queuer = new Queuer( this );
		queuer._prepare( this );
		return queuer;
	};
	
	// For those who can't count :D
	$.fn.meanwhile = $.fn.done = function(){
		return this;
	};	
	
	/* Last queue saving */
	
	$.fn.activeQueue = function( name ){
		return this.data( 'activeQueue', name );
	};
	
	/* For Ajax */
	
	$.fn.__load = $.fn.load;
	$.fn.load = function( url, params, callback ){
		if( typeof url == 'string' ){
			var _callback = callback;
			callback = function(){
				if( _callback )
					_callback.apply( this, arguments );
				$(this).dequeue('ajax');
			};
			this.activeQueue('ajax');
		}
		return this.__load( url, params, callback );
	};
	
	/* For FX */
	
	$.fn._animate = $.fn.animate;
	$.fn.animate = function( a, d, c ){
		return this.activeQueue('fx')._animate(a,d,c);
	};
	
	/* Simple delay */

	$.fn.wait = function( time ){
		var $self = this;
		setTimeout(function(){
			$self.dequeue('delay');
		}, time );
		return $self.activeQueue('delay');
	};
	
	/* For events */
	
	// could overload $.event.handle but I'd rather not
	// or won't be unbound for events prior to this code
	
	function handleEvent( e ){
		var $self = $(this),
			event = e.type.split('.')[0],
			queue = $self.queue(event).concat();
			
		$self.dequeue( event ).queue( event, queue );
	};
	
	$.fn.when = $.fn.on = function( event ){
		return this.activeQueue(event).bind( event, handleEvent ).then();
	};
	
})( jQuery );