/**
 * jQuery.Modularize
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date:4/17/2008
 *
 * @projectDescription Modular methods on jQuery.
 *
 * @author Ariel Flesler
 * @version 1.0.0
 */
 
/**
 * Note
 *	The plugin is coded in such a way, that no closure is formed.
 *	There're also no references to variables in other scopes.
 *	This is garbage-collection friendly.
 */
/**
 * Note
 *	You can call $.modularize after adding all the methods or before.
 *	If no 'old' function is received, and there was one already stored, it is used.
 */

/**
 * Adds a module-method to jQuery.fn or another holder.
 * @param {String} name The name to take from jQuery.fn (or the holder).
 * @param {Function} old Optional function to be called when $.fn[name]( a, b, c, ... ); is called
 * @param {Function, Map} holder Where to save the function, if none is given, jQuery.fn is used.
 *
 * Note: 
 */
;
jQuery.modularize = function( name, old, holder ){
	var $ = this;//use this instead of jQuery or $.
	holder = holder || $.fn;//the third argument allows you to use this not only on $.fn
	old = old || holder[name];//you can send the function to be used when $().foo( a, b, c ) is called
	holder[name] = $.extend(function(){//this function will be saved into $.fn.foo ('foo' == name)
		return this._modularize_( arguments );
	}, old, {_o_: old} );
};

/* internal don't use */
jQuery.fn._modularize_ = function( args ){
	var me = args.callee;//args.callee == $.fn.foo (the exposed method)
	if( me._o_ && args.length )//if there are arguments, then the original is wanted
		return me._o_.apply( this, args );
	
	//if you want this hash to be regenerated on each call, set $.fn.foo.lazy = true;
	if( !me._ || me.lazy ){
		me._ = {};//stores the "fake" methods
		for( var method in me ){
			if( me[method] && me[method].call && method != '_o_' ){
				me._[method] = function(){
					return arguments.callee._.apply( this._s_, arguments );
				};
				me._[method]._ = me[method];//give the fake function, access to the original
			}
		}
	}
	me._._s_ = this;//store the last collection
	return me._;//the hash with fake methods will be used now
};