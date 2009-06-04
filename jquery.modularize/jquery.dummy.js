/**
 * This is a dummy plugin, not a real one.
 * don't expect these methods to make sense.
 */
;(function( $ ){
	
	var $ul = $('<ul />').appendTo('body');//used if firebug's not detected
	
	$.fn.dummy = function(){
		if( window.console && console.log )//use firebug to see the results clearer
			console.log.apply( console, arguments );
		else
			$('<li />').text( 'LOG: ' + [].join.call(arguments, ' ') ).appendTo( $ul );
		return this;
	};
	
	//you can call $.modularize after or before adding the methods
	$.modularize( 'dummy' );
	
	//also $.modularize( 'dummy', function(){ ... }); is a shortcut for the first 2 statements
	
	$.fn.dummy.size = function(){
		return this.dummy( this, ' has ', this.length, ' elements' );
	};
	$.fn.dummy.cssClass = function( css ){
		return this.addClass( css ).dummy('added css class "', css, '" to ', this );
	};
	
	//you are not restricted to $.fn, you can nest more methods
	$.modularize( 'cssClass', null, $.fn.dummy );//instead of null, one could pass the $.fn.dummy.cssClass above
	
	//the 'this' always remains the same
	$.fn.dummy.cssClass.remove = function( css ){
		return this.removeClass( css ).dummy('removed css class "', css, '" to ', this );
	};
	
})( jQuery );