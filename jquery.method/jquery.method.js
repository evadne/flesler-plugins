/**
 * jQuery.Method
 * Copyright (c) 2007-2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 1/2/2008
 *
 * @projectDescription Aspect oriented programming, in a jQuery way
 * @author Ariel Flesler
 * @version 1.0.0
 *
 * @id jQuery.method
 * @param {Function}
 * @return {jQuery.Method} Returns the same jQuery Method object, for chaining.
 */
;(function( $ ){
		  
	var $method = $.method = function( holder, name ){
		if( !(this instanceof $method ) )
			return new $method( holder, name );
		
		if( typeof holder == 'string' ){
			name = holder;
			holder = window;	
		}
		
		var method;
		if( typeof name == 'string' ){
			method = this.original = holder[name];
			var $m = this;
			holder[name] = function(){ return $m.run( arguments );	};
			holder[name].revert = function(){ $m.revert();	};
			this.holder = holder;
			this.name = name;
		}else if( typeof holder == 'function' ){
			method = holder;
		}
		this.fns = [ method ];
		this.stack = [ ];
		this.now = 0;
	};
	
	$method.fn = $method.prototype = {
		run:function(){
			var old = this.now, 
				scope = this.holder || this,
				args = arguments.length == 1 && arguments[0].callee ? arguments[0] : arguments,
				ret;
			
			this.now = 0;
			while( this.now < this.fns.length ){
				ret = this.fns[this.now++].apply( scope, args );
				this.stack.unshift( ret );
			}
			this.now = old;
			return this;
		},
		after:function( fn, move ){
			this.fns.splice( this.now + 1, 0 , fn );
			return move ? this.next() : this;
		},
		before:function( fn, move ){
			this.fns.splice( this.now++, 0 , fn );
			return move ? this.prev() : this;
		},
		prev:function(){
			if( this.now )
				this.now--;
			return this;
		},
		next:function(){
			if( this.now < this.fns.length - 1 )
				this.now++;
			return this;
		},
		remove:function( q ){
			this.fns.splice( this.now, q || 1 );
			return this.prev();
		},
		eq:function( num ){
			if( num >= 0 && num < this.fns.length )
				this.now = 	num;
			return this;
		},
		onlyIf:function( fn ){
			var that = this;
			return this.before(function(){
				if( fn.apply( this, arguments ) !== true )
					that.now = that.fns.length;
			});
		},
		unless:function( fn ){
			return this.onlyIf(function(){
				return fn.apply(this,arguments) !== true;
			});
		},
		revert:function(){
			if( this.original )
				this.holder[this.name] = this.original;
			return this;
		}
	};	
		
})( jQuery );