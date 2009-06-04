/*!
 * jQuery.Plugin
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 3/5/2008
 *
 * @projectDescription Lazy loading of jQuery Plugins
 *
 * @author Ariel Flesler
 * @version 1.0.0
 */
;(function( $ ){
	
	var $plugin = $.plugin = function( url, names, settings ){		
		var self = $.extend( this, $plugin.defaults, settings );

		self.q = [];
		self.url = self.base + url + self.ext;
		eachNS( names, function( scope, name ){
			self.add( scope, name );
		});
		if( self.id )
			$plugin.registry[self.id] = self;
		if( typeof self.require != 'object' )
			self.require = [self.require];
	};
	
	$plugin.register = function( names, url, settings ){
		return new $plugin( names, url, settings );
	};
	
	$plugin.prototype = {
		constructor: $plugin,
		queue:function( scope, name, args ){
			this.q.push({ s:scope, n:name, a:args });
		},
		add:function( scope, name ){
			var self = this;
			scope[name] = function(){
				if( self.loaded )
					throw '$.plugin > "'+self.url+'" didn\'t add the method "'+name+'".';
				self.queue( this, name, arguments );
				if( !self.loading ){
					var ret = self.preload();
					if( self.sync )
						return ret;
				}
				return this;
			};	
		},		
		load:function( caller ){
			var self = this, ret;
			$([$plugin,self]).trigger('loading',[self]);
			$.ajax({
				cache:self.cache,
				url:self.url,
				async:!self.sync,
				dataType:'script',
				success:function(){
					$([$plugin,self]).trigger('loaded',[self]);
					self.loaded = true;
					ret = self.execute();
					if( self.caller ){//let the caller know one of its dependencies is ready
						self.caller.missing--;
						ret = self.caller.check();
					}
				}
			});	
			return ret;//only for synchronic
		},
		check:function(){
			if( !this.missing )
				return this.load();
		},
		preload:function(){
			var self = this, callees, ret;
			if( self.loading ) return;
			self.loading = true;
			callees = $(self.require).map(function( i, id ){//map will clean bad ids
				return $plugin.registry[id];
			});
			self.missing = callees.length;
			callees.each(function(){
				//if one the caller is sync, it "infects" the callee
				if( this.loading )//already loading or loaded
					self.missing--;
				else{
					this.sync = self.sync || this.sync; 
					this.caller = self;//store it
					ret = this.preload();
				}
			});
			return self.sync && ret != null ? ret : self.check();
		},
		execute:function(){
			var ret, obj;
			while( obj = this.q.shift() )
				ret = obj.s[obj.n].apply( obj.s, obj.a );
			return ret;
		},
		register:$plugin.register //for chaining
	};
	
	$plugin.defaults = {
		base:'',
		ext:'',
		cache:true,//use false to add jquery trick to avoid caching
		require:[] //don't touch
		/*
		sync:false
		*/
	};
	
	$plugin.registry = {};
	
	$.each(['bind','unbind','trigger'],function( i, method ){
		$plugin[method] = $plugin.prototype[method] = function(a,b,c){
			return $([this])[method]( a, b, c );
		};
	});
	
	function eachNS( names, callback ){
		$.each( names, function( key, names ){
			var scope = key == '$' ? $ : $.fn;
			if( typeof names == 'string' )
				callback( scope, names );
			else
				$.each( names, function( i, name ){
					callback( scope, name );
				});	
		});
	};
	
})( jQuery );