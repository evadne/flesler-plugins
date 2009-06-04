/*!
 * jQuery.Survey
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 4/3/2008
 *
 * @projectDescription Survey generator.
 * http://flesler.blogspot.com/
 *
 * @author Ariel Flesler
 * @version 1.0.0
 */
;(function( $ ){
	
	var $survey = $.survey = function( settings ){
		if( !(this instanceof $survey ) )
			return new $survey( settings );
			
		var that = $.extend( this, settings );
		
		if( that.data ){
			digest( that.data );
			delete that.data;//release from memory
		}else if( that.dataURL )
			$.get( that.dataURL, digest, that.dataType );
		
		function digest( data ){
			that.digest( data );
			//you can pass a function setting called 'onReady' that is called when the data is parsed
			if( that.onReady )
				that.onReady();
		};		
	};
	
	$.extend( $survey, {
		//you can add your own parsers, and use them by specifying their name in the 'parser' setting.
		parsers:{
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
		},
		types:{},
		/**
		 * register your own types of questions, the plugin includes many built-in
		 * the register function will receive the question hash, and a function that
		 * you must call each time the answer is changed, passing it JUST the new value
		 */
		register:function( type, dom ){
			$survey.types[type] = dom;
		}
	});

	$survey.prototype = $survey.fn = {
		dataType:'json',//if the data is requested, specify the type
		parser:'none', //parsed the data, add your own parser to $.survey.parsers and use it here.
		//this function can be overriden to change the way previously hidden questions are shown
		show:function( $dom ){
			$dom.show(400);
		},
		//this function can be overriden to change the way questions are hidden
		hide:function( $dom ){
			$dom.hide(400);
		},
		//this function can be overriden in the settings to change the structure of questions
		addQuestion:function( title, content ){
			title = $('<div class="title" />').append('<h2>'+title+'</h2>');
			content = $('<div class="content" />').append(content);
			
			return $('<li />').append(title).append(content).appendTo( this.$target );
		},
		digest:function( data ){
			this._data_ = $survey.parsers[this.parser]( data );
			return this;
		},
		update:function( id, value ){
			this.answers[id] = value;
			this.require( this.questions[id] );
			if( this.onUpdate )
				this.onUpdate( id, value, this.answers );
		},
		build:function( target ){
			var that = this;
			if( !that._data_ ) return;
			
			that.questions = {};
			that.answers = {};		
			that.$target = $(target);
			
			$.each( that._data_, function( index, question ){
				if( 'def' in question == false )//be careful with false's
					question.def = '';
				question.number = index+1;

				var generator = $survey.types[question.type];
				
				question.$dom = generator( question, function(value){
					that.update( question.id, value );
				});
				
				question.$dom = that.addQuestion( question.title, question.$dom );
				
				if( question.cssClass )
					question.$dom.addClass(question.cssClass);
				
				if( question.require ){
					$.each( question.require, function( i, parent ){
						var qtn = that.questions[parent.id];
						if( !qtn.children )
							qtn.children = {};
						qtn.children[question.id] = parent.value;
					});
				}
				
				that.answers[question.id] = question.def;				
				that.questions[question.id] = question;
			});
			delete that._data_;
			
			$.each( that.questions, function(i,qtn){
				that.require( qtn, true );
			});
			
			return that;
		},
		require:function( question, init ){
			if( !question.children ) return;
			
			var that = this,
				value = that.answers[question.id];		
			$.each( question.children, function( id, required ){
				var $dom =  that.questions[id].$dom,
					visible = $dom.is(':visible'),
					right = required == value,
					method = visible ? 'hide' : 'show';
				
				if( visible != right ){
					if( init )
						$dom[method]();
					else
						that[method]( $dom );
				}
			});
		}
		
	};
	
	$.fn.survey = function( settings ){
		return this.each(function(){
			$.survey( settings ).build( this );
		});
	};
	
})( jQuery );