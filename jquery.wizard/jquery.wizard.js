/*!
 * jQuery.Wizard
 * Copyright (c) 2007-2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 2/28/2008
 *
 * @projectDescription
 *
 * @author Ariel Flesler
 * @version 1.0.0
 *
 * @id jQuery.wizard
 * @id jQuery.fn.wizard
 * @return {jQuery} Returns the same jQuery object, for chaining.
 */
;(function( $ ){
	
	var $wizard = $.wizard = function( settings ){
		if( !(this instanceof $wizard ) )
			return new $wizard( settings );
			
		$.extend( this, { vars:{}, pos:0 }, settings );
		
		if( this.dataURL )
			this._request_( this.dataURL, 'digest', this.dataType );
		if( this.templateURL )
			this._request_( this.templateURL, 'template', 'text' );
	};
	
	$.extend( $wizard, {
		parsers:{
			json:function( data ){
				var parsed = [ ];
				$.each( data, function( name, text ){
					parsed.push({ name:name, text:text });
				});
				return parsed;
			},
			none:function( data ){ return data; },
			xml:function( data ){
				return $('>*>*',data).map(function(i,node){
					var obj = {};
					$(node).children().each(function(){
						obj[this.nodeName.toLowerCase()] = $(this).text();
					});
					return obj;
				}).get();
			}
		}
	});

	$wizard.prototype = $wizard.fn = {
		dataType:'json',
		parser:'json',
		digest:function( data ){
			this._data_ = $wizard.parsers[this.parser]( data );
			this.check();
		},
		template:function( str ){
			if( !this.$template )
				this.$template = $.template(str,this.pre);
			else
				this.$template.source(str);
			this.check();
		},
		ask:function(){
			var self = this, found, i=0,
				data = self._data_ && self._data_[self.pos];
				
			if( !data ){
				self.checkEnd();
			}else{
				switch( typeof data.requires ){
					case 'object':
						while( i in data.requires ){
							if( found = self.vars[data.requires[i++]] )
								break;
						}
					break;
					case 'string': 
						if( !(found = self.vars[data.requires]) )
							this.next();
					break;
					default: found = true;
				}
				if( found )
					self.show( data, function(value){
						self.vars[data.name] = value || '';
						self.checkEnd();
					});
			}
		},
		checkEnd:function(){
			if( !this.ended && this.pos >= this._data_.length -1 ){
				this.ended = true;
				this.onEnd();
			}
		},
		show: function( data, handler ){ // can/should be overwritten by a nicer one
			var reply = data.bool ? confirm(data.text) ? 1 : '' : prompt( data.text, data.def||'' );
			handler( reply );
			this.next();
		},
		moveTo:function( pos ){
			this.pos = pos;
			this.ask();
		},
		prev:function(){
			this.moveTo( this.pos - 1 );
		},
		next:function(){
			this.moveTo( this.pos + 1 );
		},
		generate:function(){
			return this.$template && this.$template.apply( this.vars );
		},
		onEnd:function(){// can/should be overwritten
			//return this.generate();
		},
		check:function(){
			if( this._data_ && this.$template )
				this.onReady();
		},
		_request_:function( url, method, type ){
			var self = this;
			$.get( url, {id:self.id}, function( res ){
				self[method]( res );
			}, type );
		},
		onReady:function(){
			this.ask();
		}
	};
	
	//add chaining
	/*$.each( $wizard.fn , function( key, fn ){
		$wizard.fn[key] = !$.isFunction(fn) ? fn : function(){
			var ret = fn.apply(this,arguments);
			return ret !== undefined ? ret : this;
		};
	});*/

})( jQuery );