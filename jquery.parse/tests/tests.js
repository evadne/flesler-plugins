function stringify(val) {
	if (typeof val === 'string')
		val = '"'+val+'"';
	return val;
}

function assert(str, value) {
	var status = jQuery.parse(str) === value ? 'ok' : 'fail';
	
	str = stringify(str);
	value = stringify(value);

	document.write('<p class="'+status+'">'+status.toUpperCase() +' - jQuery.parse('+ str+') === '+value+'</p>');
}

// Numbers
assert('1', 1);
assert('1.5', 1.5);
assert('1.0', 1.0);
assert('-1', -1);
assert('-1.5', -1.5);
assert('0xFF', 255);
assert('0xff', 255);
assert('-0xFF', -255);
assert('1e3', 1000);
assert('-1e3', -1000);

// Octal notation isn't supported
assert('010', 10);

// Nearly numbers
assert('-1.5a', '-1.5a');
assert('1.5a', '1.5a');
assert('a1.5', 'a1.5');
assert('0xAG', '0xAG');

// Booleans
assert('true', true);
assert('false', false);

// Unrecognized strings
assert('null', 'null');
assert(null, null);

assert('undefined', 'undefined');
assert(undefined, undefined);

assert('foo', 'foo');
assert('', '');
