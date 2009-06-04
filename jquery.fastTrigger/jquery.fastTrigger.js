/*!
 * jQuery.FastTrigger
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 4/5/2008
 *
 * @projectDescription Faster event triggering for jQuery.
 *
 * @author Ariel Flesler
 * @version 1.0.0
 */
;(function( $ ){
	
	//this is a fake event object, will stay with us all along, don't break it
	var event = {
		//no need for real data, what data would you expect from a programmatic trigger
		pageX:0,
		pageY:0,
		which:0,
		button:0,
		metaKey:false,
		ctrlKey:false,
		charCode:' ',
		keyCode:0,
		//no need for real functions
		preventDefault:function(){},
		stopPropagation:function(){}
	};

	$.fn.fastTrigger = function( type, args ){
		var e = event,
			ns, any = true;//any is the same as "not-exclusive"
		
		if( !args || !args.length )//what if args is a string ? args CAN'T be a string (docs.jquery.com).
			args = null;//args must be an array, or nothing
		else if( args[0].preventDefault )
			e = args[0];		
		else
			args.unshift( e );
		
		if( type.indexOf('!') != -1 ){
			any = false;//exclusive
			type = type.slice(0, -1);
		}
		
		ns = type.split('.');
		e.type = type = ns[0];//ensure the right type
		any &= !(ns = ns[1]);//cache this value, no need to check all each time

		return this.each(function(){
			var 
				handlers = ( $.data(this,'events') || {} )[type],//don't do 2 $.data like jQuery, they are slow
				handler;

			if( handlers ){
				e.target = e.relatedTarget = this;
				for( var i in handlers ){
					handler = handlers[i];
					if(	any || handler.type == ns ){
						e.data = handler.data;
						if( args )//call is slightly faster, thus preferred
							handler.apply( this, args );
						else
							handler.call( this, e );
					}
				}
			}
		});
	};
	
	$.fastTrigger = function( type, args ){
		//the native method is not THAT faster, but still better
		$(document.getElementsByTagName('*')).add([window,document]).fastTrigger( type, args );
	};
	
})( jQuery );