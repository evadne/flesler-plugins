/*!
 * jQuery.Accessible - Adds a validator functionality to rules and a set of tests.
 * Copyright (c) 2007-2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 12/27/2007
 *
 * @projectDescription Fixes and advices for more accessible sites.
 * @author Ariel Flesler
 * @version 0.1
 *
 * @id jQuery.accessible.addTest
 * @param {String} id An identifier for the test (can be shared with a fix).
 * @param {String} msg The message explaining the recommendation.
 * @param {String|Array<String>} urls Optional: 1 or more references to sites to read more about this recommendation.
 * @param {Function} achieved Optional: A function that checks if the recommendation is implemented.
 *
 * @id jQuery.accessible.runTests
 * @param {String|HTMLElement|jQuery} parent Optional:Where to append the results (the body will be used if none is given)
 **/
;(function( $ ){	
	$.extend( $.accessible, {
		PASSED:1,
		FIXED:2,
		FAILED:3,
		readMore:'<em><strong>Read more:</strong></em>',
		getTestClass:function( state ){
			switch( state ){
				case this.FIXED: return 'fixed';
				case this.PASSED: return 'passed';
				default: return 'failed';
			}
		},
		getTestDesc:function( state, text ){
			state = this.getTestClass(state).toUpperCase();
			return '<strong>' + state + '</strong>:' + text;
		},
		getReadMoreLink:function( i, url ){
			return $('<a class="readmore" />').attr('target','_blank').attr('href', url).text((i+1).toString());	
		},
		addTest: function( id, msg, urls, achieved ){
			if( typeof urls == 'string' )
				urls = [urls];
			if( !urls || !urls.splice ){
				achieved = urls;
				urls = [ ];
			}
			var r = $.accessible.rules;
			r[id] = $.extend( r[id] || { done:false } , {
				msg: msg,
				achieved: achieved,
				urls:urls
			});
		},
		runTests:function( parent ){
			var self = $.accessible;
			$.fn.ready(function(){
				var $list = $('<ul class="jq-accessible-tests" />');
				
				$.each( self.rules, function( id, rule ){
					if( !rule.msg ) return;
					var state = rule.done ? self.FIXED : rule.achieved && rule.achieved( $ ) ? self.PASSED : self.FAILED;
					var $li = $('<li />').attr('id', id ).addClass( self.getTestClass(state) ).appendTo($list);
					
					$('<span />').html( self.getTestDesc(state, rule.msg) ).appendTo($li);
					
					if( rule.urls.length ){
						$li.append( self.readMore );
						$(rule.urls).map( self.getReadMoreLink ).appendTo($li);
					}
				});
				$list.appendTo( parent || 'body' );
			});
		}
	});
	
	var add = $.accessible.addTest;
	
	add('js_class','You can style differently for JS and non-JS users, according to a CSS class in the document.', function(){
		return $(document.documentElement).is('.js');
	});
	
	//http://www.calstatela.edu/accessibility/manual.htm II-A-7
	add('noscript', 'You could use a &lt;noscript&gt;, to give non-JS users a message.',
		'http://www.calstatela.edu/accessibility/manual.htm',
		function(){
			return !!$('noscript').length;
		}
	);
	
	add('anchors_title', 'You should set "title" to every link, unless the text is clear enough.',
		'http://diveintoaccessibility.org/day_14_adding_titles_to_links.html',
		function(){
			return !$('a[title=]').length;
		}
	);
	
	add('img_alt', 'You should add "alt" or "longdesc" for images, unless they are merely decorative.',
		['http://juicystudio.com/article/html5-image-element-no-alt.php',
		 'http://diveintoaccessibility.org/day_23_providing_text_equivalents_for_images.html'],
		function(){
			return !$('img[alt=][longdesc=]').length;
		}
	);
	
	add('labels', 'All form elements should have a label wrapping them, or associated by the "for" attribute.',
		['http://diveintoaccessibility.org/day_28_labeling_form_elements.html',
		 'http://www.w3.org/TR/REC-html40/interact/forms.html#edef-LABEL'],
		function(){
			var $labels = $('label[for]'), right = true;
			$('input,textarea,select').each(function(){
				if( this.parentNode.nodeName != 'LABEL' 
					&& (!this.id || $labels.filter('[for='+this.id+']').length == 0 ) )
						return right = false;
			});
			return right;
		}
	);
	
	add('table_summary', 'Non-layout tables should have a "summary" attribute for screen readers.',
		'http://diveintoaccessibility.org/day_20_providing_a_summary_for_tables.html',
		function(){
			return !$('table[summary=]').length;
		}
	);
	
	//http://www.calstatela.edu/accessibility/manual.htm II-D-2
	add('a_js_href', 'Don\'t put javascript: in the href of links, bind the "onclick" with return false instead, and give a degrading href.',
		'http://diveintoaccessibility.org/day_13_using_real_links.html',
		function(){
			return !$('a[href*=javascript:]').length;
		}
	);
	
	add('accesskey', 'You should define accesskeys for your users.',
		['http://diveintoaccessibility.org/day_15_defining_keyboard_shortcuts.html',
		 'http://www.cs.tut.fi/~jkorpela/forms/accesskey.html'],
		function(){
			return !!$('*[accesskey]').length;
		}
	);
	
	add('acronym', 'You should add "acronym" tags for better comprehension of some terms.',
		'http://diveintoaccessibility.org/day_17_defining_acronyms.html',
		function(){
			return !!$('acronym').length;
		}
	);
	 
})( jQuery );
