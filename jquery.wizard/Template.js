/*!
 * Template/jQuery.Template
 * Copyright (c) 2007-2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 2/29/2008
 *
 * @projectDescription JS Templating Class.
 *
 * @author Ariel Flesler
 * @version 1.0.1
 */
//Check by the end of the file, there're details on how to use and extend
;(function(){
	
	var OPEN = 1,//token that starts a block
		CLOSE = 2,//token that ends a block
		CLOSED = 3;//token that does neither of the previous
	
	var $template = function( text, pre ){
		if( !(this instanceof $template ) )
			return new $template( text, pre );
		this.source(text||'');
		if( typeof pre == 'function' )
			this.pre = pre;//pre is a function to add/modify variables before parsing.
	};
	
	$template.prototype = {
		source:function( text ){
			this.text = text;
			this.compiled = false;	
		},
		apply:function( vars ){
			this.vars = vars || {};
			this.compile();
			this.pre( this.vars );
			return this.parse( this.tokens );
		},
		compile:function(){
			if( this.compiled  ) return;
			this.compiled = true;
			this.tokenize();
			this.arrange();
		},
		tokenize:function(){//generate a flat array of tokens/textnodes
			var tokens = this.tokens = [ ];
			var rest = this.text.replace( $template.token, function( all, text, end, type, data, closed ){
				if( text )
					tokens.push( new Token(text) );//preceeding textnode
				var mode = closed == '/' ? CLOSED : end == '/' ? CLOSE : OPEN;//starts/ends a block, or single node block
				tokens.push( new Token(data, type, mode) );				
				return '';
			});
			if( rest )//trailing textnode
				tokens.push( new Token(rest) );
		},
		arrange:function(){//re-arrange the flat array, into a stack
			var tokens = this.tokens, i = -1, token,
				arranged = this.tokens = [ ], stack = [];
			
			while( token = tokens[++i] ){
				if( token.OPEN ){//nest a new block
					stack.push( arranged );
					arranged = arranged[arranged.length] = [];
				}
				arranged.push(token);
				if( token.CLOSE )//un-nest
					arranged = stack.pop();
			}
			while( stack.length )
				arranged = stack.pop();
		},		
		pre:function( vars ){},//optionally, pass a function to parse the variables map before application
		parse:function( tokens ){
			var i = -1, str = '', buffer = [ ], token, fn, txtnode;
			while( token = tokens[++i] ){
				fn = $template.handlers[token.type];//cache the handler
				if( token.push )//an array, means a nested block
					token = this.parse(token);
				else if( token.CLOSED && fn )//closed node, parse on the fly
					token = fn( token, this.vars );
				if( token.OPEN || buffer.length ){//start or continue a new block
					if( txtnode && token.split )//merge textnodes
						buffer[buffer.length-1] += token;
					else
						buffer.push( token );
					txtnode = token.split;//for the next iteration
				}
				if( token.CLOSE ){//end a block
					token = fn && fn( buffer, this.vars ) || '';
					buffer.length = 0;
					last = null;
				}
				if( !buffer.length )//if not buffering, add to returned string
					str += token;
			}
			return str;
		}	
	};
	
	/* here I could just store the mode, instead of 3 bools, but then the parse loop takes X 12 !! */
	function Token( data, type, mode ){
		this.data = data;
		this.type = type || 'text';
		this.OPEN = mode == OPEN;
		this.CLOSE = mode == CLOSE;
		this.CLOSED = !mode || mode == CLOSED;
	};
	
	Token.prototype.getData = function( vars ){
		return this.type == 'text' || !this.data ? this.data : this.data.replace($template.variable,function(all,name){
			return vars[name] || '';
		}); 
	};
	
	/**
	 * matches a token, can be changed but respect the back-references
	 * A token starts with '<' then if it closes a block, it has a '/' else '?'. The word found right after, is the command.
	 * The rest is store as the data of the token and accessed with token.getData(hash_of_values).
	 * If the token is self-closed (doesn't start a block) it must end as '/>' else '?>'.
	 */
	$template.token = /([^<]*?)<(\/|\?)([=-]|\w+) ?(.*?)([\/?])>/gm;
	/**
	 * matches variables inside tokens, they are replaced with the value, can be changed but respect the back-reference
	 * Can be <?if $var?>... or <?if ${var}?>...
	 */
	$template.variable = /\$\{?(\w+)\}?\b/g;
	
	
	$template.operation = /^(.*?)([=<>!]=?)(.*)$/;
	$template.match = function( data ){
		if( !data ) return false;
		data = data.match($template.operation);
		if( data == false ) return true;
		try{
			data[0] = 'data=';
			data.push('');
			eval(data.join('"'));
		}catch(e){
			data = false;
		}
		return data;
	};
	
	//you can add handlers, bear in mind that if it's a self-closing token, you get the token
	//but if it's not, you get an array with all the nodes from the start to the end
	$template.handlers = {
		/**
		 * if/elseif/if, is used like this:
		 * <?if $some_var?>foo = 3;<?elseif $another_var/>foo = 4<?else/>bar = ''</if?>
		 * You can use nested if's and any other token as well.
		 */
		'if':function( arr, vars ){
			while( arr.length ){
				var token = arr.shift(), data,
					text = typeof arr[0] == 'string' ? arr.shift() : '';
				switch( token && token.type ){
					case 'elseif':
					case 'if':
						if( !$template.match(token.getData(vars)) )
							break;
					default:
					case 'else':
						return text;
				}
			}
		},
		//repeat a pattern, <?loop 10?>*</loop?>, can have if's or any other token inside.
		loop:function( arr, vars ){
			var times = parseInt(arr[0].getData(vars),10) || 0;
			return Array(times+1).join(arr[1]||'');
		},
		//this token is generated from text nodes between tokens.
		text:function( token ){
			return token.getData();
		},
		ignore:function(){
			return '';
		},
		//ignore new lines
		'-':function( arr ){
			return arr[1].replace(/\n/g,'');
		},
		//variable insertion <?=name_of_variable/>
		'=':function( token, vars ){
			return vars[token.getData(vars)] || '';
		}
	};
	
	if( this.jQuery )
		jQuery.template = $template;
	else
		this.Template = $template;
	
})();