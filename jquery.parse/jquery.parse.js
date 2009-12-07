/*!
 * jQuery.Parse
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 12/07/2009
 *
 * @projectDescription Simple string evaluation.
 * @author Ariel Flesler
 * @version 1.0.1pre
 *
 * @id jQuery.parse
 * @param {String} token The string to evaluate.
 * @return {String, Number, Boolean} The parsed data.
 */

;jQuery.parse = function(token) {

	// Handle booleans
	if (token === 'true')
		return true;
	if (token === 'false')
		return false;

	// Skip none-strings or empty ones
	if (token && typeof token === 'string')
		// Handle positive & negative numbers (integer or float)
		// Handle hexadecimal numbers: 0xFF -> 255
		// Handle exponential notation: 1e5 -> 100000
		var num = +token;
	
	if (!isNaN(num))
		return num;

	// Everything else remains untouched
	return token;		
};