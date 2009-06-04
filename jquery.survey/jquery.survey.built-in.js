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
	
	var register = $.survey.register;
	//one line text field
	register('line',function( question, update ){
		var $el = $('<input type="text" class="text" />').attr('name',question.id).val( question.def );
		return $el.change(function(){
			update( this.value );
		});
	});
	//multi-line text field can get the option 'rows' with the amount.
	register('paragraph',function( question, update ){
		var $el = $('<textarea />').attr('name',question.id).val( question.def );
		if( question.rows )
			$el[0].rows = question.rows;
		return $el.change(function(){
			update( this.value );
		});
	});
	//true/false, it's a checkbox, use the option 'value' to specify the text
	//in the 'def' option, use true or false, not 'checked'.
	register('bool',function( question, update ){
		var $el = $('<input type="checkbox"'+(question.def?' checked="checked"':'')+' />')
						.attr('name',question.id)
						.click(function(){
							update( this.checked );
						});
		return $('<label />').text( question.value|| '' ).prepend( $el );
	});
	//group of radios, needs an array of values, texts or just one of them.
	//can use instead, an option 'from' and 'to' and will generate all the numbers as values.
	register('choice',function( question, update ){
		choice( question );
		
		var $labels = $(question.texts).map(function( i, text ){
			return $('<label />').text( text ).get(0);
		});
		
		var $els = $labels.map(function( i ){
			return $('<input type="radio" />').val(question.values[i]).prependTo(this).get(0);
		});
		$els.attr('name',question.id).click(function(){
			update( this.value );
		});
		
		if( question.def ){
			if( $.browser.msie )
				setTimeout(check,200);
			else
				check();
		}
		
		function check(){
			$els.filter('[value='+question.def+']').attr('checked',true);
		};
		
		return $labels;
	});
	//select box, needs an array of values, texts or just one of them.
	//can use instead, an option 'from' and 'to' and will generate all the numbers as values.
	register('select',function( question, update ){
		choice( question );
		
		var index = 0,
			$options = $(question.texts).map(function( i, text ){
				var option = document.createElement('option');
				option.value = question.values[i];
				option[$.browser.msie?'innerText':'text'] = text;
				if( option.value == question.def )
					index = i;
				return option;
			});
		
		var $select = $('<select />').append($options).attr('name',question.id).change(function(){
			update( this.value );
		});
		
		if( question.def )
			$select[0].selectedIndex = index;
		
		return $select;
	});
	
	function choice( question ){//repetitive action
		if( !question.values ){
			if( 'from' in question && 'to' in question ){
				question.values = [ ];
				for( var i=question.from; i <= question.to; i++ )
					question.values.push(i);
			}else if( question.texts )
				question.values = question.texts;
		}
		if( !question.texts )
			question.texts = question.values;
	};
	
})( jQuery );