if( !window.console || !console.time ){
	var console = {
		log:function(){
			this.list.appendChild(document.createElement('li')).appendChild(
				document.createTextNode([].join.call(arguments,': '))
			);
		},
		list:document.body.appendChild(document.createElement('ol')),
		clock:{},
		time:function( name ){
			this.clock[name] = new Date().getTime();	
		},
		timeEnd:function( name ){
			var now = new Date().getTime(), time = now - this.clock[name];
			this.log( name, time + 'ms' );
			delete this.clock[name];
			return time;
		}
	};
}
console.benchmark = function( fn, times, id, cb ){
	id = id || 'test';
	var i = times+1, sum = 0;
	
	while( --i ){
		console.time(id);
		fn();
		sum += console.timeEnd(id);
	}
	console.log('average of '+name, sum/times);
	if( cb )
		cb();
	return sum;
};
