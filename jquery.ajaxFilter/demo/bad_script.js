var $logs = jQuery('#logs').empty();

for( var i=1; i <= 10; i++ ){
	$logs.append('<li>Alert attempt #'+ i + '</li>');
	alert('Weeeeee.... uhhhh... annoying!!!');
}