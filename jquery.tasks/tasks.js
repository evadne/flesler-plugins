/*!
 * Tasks
 * Copyright (c) 2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 4/15/2009
 *
 * @projectDescription Sequential and parallel tasks
 *
 * @author Ariel Flesler
 * @version 1.0.0
 */
;(function( scope ){
	
	// General
	
	function makeArray( data ){
		if( data == null )
			return [];
		if( data.length == null )
			return [data];
		return map(data,function(v){
			return v;
		});
	};
	
	function empty(){ };
	
	function emptyObject(Class){
		empty.prototype = Class.prototype;
		return new empty();
	};
	
	function instantiate( Class, args ){
		var obj = emptyObject(Class);
		Class.apply(obj, args);
		return obj;
	};
	
	function removeElement( arr, obj ){
		foreach(arr,function(elem,i){
			if( arr[i] == obj )
				arr.splice(i,1);
		});
	};
	
	function createBase( fn, base ){
		return function(){
			var old = this.base;
			this.base = base;
			var r = fn.apply(this,arguments);
			this.base = old;
			return r;
		};
	};
	
	// Reversed
	function foreach( list, fn, context ){
		for( var i = list.length - 1; i >= 0; i-- )
			fn.call(context, list[i], i );
	};
	
	function map( list, fn, context ){
		var arr = [];
		foreach(list, function(v,i){
			arr[i] = fn.call(context,v,i);
		});
		return arr;
	};
	
	// Class
	
	function extend( fn, proto ){
		return Class( fn, proto, this );
	};
	
	function Class(clazz, members, base){
		base = base || Object;
		clazz = createBase(clazz, base);
		var proto = clazz.prototype = emptyObject(base),
			bp = base.prototype;

		for( var name in members )
			proto[name] = members[name];
		
		for( name in bp ){
			if( name in members ){
				if( !/base|toString/.test(name) && typeof bp[name] == 'function' )
					proto[name] = createBase(members[name],bp[name]);
			}else{
				proto[name] = bp[name];
			}		
		}

		proto.constructor = proto.clazz = clazz;
		proto.base = base;
		
		clazz.base = base;		
		clazz.extend = extend;
		return clazz;
	};
	
	
	var ns = { };
	
	// Task
	
	ns.Task = Class(function(){
		this.listeners = [];
		this.elapsed = 0;
	}, {
		running:false,
		start:function(){
			this.running = true;
		},
		stop:function(){
			this.running = false;
		},
		addListener:function(obj){
			removeElement(this.listeners, obj);
			this.listeners.push(obj);
		},
		removeListener:function(obj){
			removeElement(this.listeners, obj);
		},
		complete:function(){
			this.running = false;
			foreach(this.listeners,function(obj){
				obj.childComplete(this);
			}, this);
		},
		childComplete:function(task){
			task.removeListener(this);
		},
		update:function(millis){
			this.elapsed += millis;
		},
		toString:function(){
			var s = this.clazz.className;
			return s ? '[object '+s+']' : this.base();
		},
		updateSubTask:function(task,millis){
			if( !task.running )
				return 0;

			var prev = task.elapsed;
			task.update(millis);
			return task.elapsed - prev;
		},
		clone:function(){
			return null;
		},
		dispose:function(){
			for( var key in this ){
				if( this.hasOwnProperty(key) && !/number|string/.test(typeof this[key]) )
					delete this[key];
			}
		}
	});
	
	ns.Task._abstract_ = true;
	
	// TaskContainer
	
	// autoStart is uncomfortable to be passed as argument in the contructor
	ns.TaskContainer = ns.Task.extend(function( autoStart, elems ){
		this.base();
		this.autoStart = autoStart;
		if( elems && elems.length == 1 && 'length' in elems[0] )
			elems = elems[0];
		this.subtasks = makeArray(elems);
	},{
		add:function(obj){
			this.subtasks.push(obj);
			
			if( this.autoStart && this.running )
				this.startChild(obj);
		},
		remove:function(obj){
			obj.removeListener(this);
			removeElement(this.subtasks, obj);
		},
		startChild:function( task ){
			task.addListener(this);
			if( !task.running )
				task.start();
		},
		childComplete:function(task){
			this.base(task);
			this.remove(task);
		},
		start:function(){
			this.base();
			//this.subtasks = this.clonedSubtasks();
			if( this.autoStart )
				this.startAllChildren();
		},
		startAllChildren:function(){
			foreach(this.subtasks, this.startChild, this);
		},
		update:function(millis){
			this.base(this.updateSubTasks(millis));
		},
		updateSubTasks:function(millis){
			if( !this.subtasks.length )
				return 0;
			return Math.max.apply(Math, map(this.subtasks,function(task){
				return this.updateSubTask(task, millis);
			}, this));
		},
		dispose:function(){
			foreach(this.subtasks,function(task){
				task.dispose();
			});
			this.base();			
		},
		clonedSubtasks:function() {
			return map(this.subtasks,function(task){
				return task.clone();
			});
		}
	});
	
	ns.TaskContainer._abstract_ = true;
	
	// Sequence
	
	ns.Sequence = ns.TaskContainer.extend(function(){
		this.base(false, arguments);
	},{
		start: function(){
			this.base();
			this.dequeue();
		},
		dequeue: function(){
			var t = this.subtasks[0];
			if( t )
				this.startChild(t);
			else 
				this.complete();
		},
		childComplete:function(task){
			this.base(task);
			this.dequeue();
		},
		clone:function(){
			return new ns.Sequence(this.clonedSubtasks());
		}
	});
	
	// Parallel
	
	ns.Parallel = ns.TaskContainer.extend(function(){
		this.base(true,arguments);
	},{
		childComplete:function(task){
			this.base(task);
			if( !this.subtasks.length )
				this.complete();
		},
		clone:function(){
			return new ns.Parallel(this.clonedSubtasks());
		}
	});
	
	// TaskRunner
	
	ns.TaskRunner = ns.TaskContainer.extend(function( interval ){
		this.base(true);
		this.interval = interval || 13;
	},{
		start: function(){
			this.base();
			
			// Ticking
			var self = this;
			clearInterval(this.tickId);
			this.updateTime();
			this.tickId = setInterval(function(){
				var last = self.time;
				self.updateTime();
				self.update( self.time - last );
			}, this.interval );
		},
		updateTime:function(){
			this.time = new Date().getTime();
		},
		stop: function(){
			this.base();
			clearInterval(this.tickId);
		},
		clone:function(){
			var t = new ns.TaskRunner(this.interval);
			t.subtasks = this.clonedSubtasks();
			return t;
		}
	});
	
	// TimeBender
	
	ns.TimeBender = ns.TaskContainer.extend(function(factor){
		this.base(true);
		this.factor = factor || 1;
		this.accum = 0;
	},{
		update: function(millis){
			this.accum += millis * this.factor;
			millis = Math.floor(this.accum);
			this.accum -= millis;
			this.base(millis);
		},
		clone:function(){
			var t = new ns.TimeBender(this.factor);
			t.subtasks = this.clonedSubtasks();
			return t;
		}
	});
	
	// Ticker
	
	ns.Ticker = ns.TaskContainer.extend(function(tick){
		this.base(true);
		this.tick = tick || 1000 / 25;
		this.accum = 0;
	},{
		update: function(millis){
			this.accum += millis;
			while( this.accum >= this.tick ){
				this.accum -= this.tick;
				this.base(this.tick);
			}
		},
		clone:function(){
			var t = new ns.Ticker(this.tick);
			t.subtasks = this.clonedSubtasks();
			return t;
		}
	});
	
	// TimeBasedTask
	
	ns.TimeBasedTask = ns.Task.extend(function(duration){
		this.base();
		this.duration = duration;
	},{
		checkComplete:function(){
			if( this.elapsed >= this.duration ){			
				this.elapsed = this.duration;
				this.complete();
			}
		}
	});
	
	ns.TimeBasedTask._abstract_ = true;
	
	// Wait
	
	ns.Wait = ns.TimeBasedTask.extend(function(millis){
		this.base(millis);
	},{
		update:function(millis){
			this.base(millis);
			this.checkComplete();
		},
		clone:function(){
			return new ns.Wait(this.duration);
		}
	});
	
	// Func
	
	ns.Func = ns.Task.extend(function(fn){
		this.base();
		this.fn = fn;
		this.args = makeArray(arguments).slice(1);
	},{
		start: function(){
			this.base();
			try {
				this.fn.apply(window, this.args);
			}finally{
				this.complete();
			}
		},
		clone:function(){
			var f = new ns.Func(this.fn);
			f.args = this.args.slice();
			return f;
		}
	});
	
	// Loop
	
	ns.Loop = ns.Task.extend(function(task, times){
		this.base();
		this.backup = task;
		this.times = times || -1;
	},{
		start: function(){
			this.base();
			this.step();
		},
		update:function(millis){
			this.base(this.updateSubTask(this.task,millis));
		},
		step:function(){
			if( this.times-- ){
				this.task = this.backup.clone();
				this.task.addListener(this);
				this.task.start();
			}else
				this.complete();
		},
		childComplete:function(task){
			this.base(task);
			task.dispose();
			this.step();
		},
		dispose:function(){
			this.backup.dispose();
			this.base();			
		},
		clone:function(){
			return new ns.Loop(this.backup, this.times);
		}
	});
	
	// Timeout
	
	ns.Timeout = ns.Wait.extend(function(fn, delay){
		this.base(delay);
		this.fn = fn;
		this.args = makeArray(arguments).slice(2);
	},{
		complete:function(){
			try{
				this.fn.apply(window,this.args);
			}finally{
				this.base();
			}
		},
		clone:function(){
			var t = new ns.Timeout(this.fn, this.duration);
			t.args = this.args.slice();
			return t;
		}
	});
	
	// Shortcut functions
	
	(function( newScope ){
		for( var name in ns ){
			delete scope[name];
			
			var clazz = ns[name];
			clazz.className = name;
			newScope[name] = clazz;
			
			if( !clazz._abstract_ ){
				var fname = name.toLowerCase();
				delete scope[fname];
				newScope[fname] = (function( Class ){
					return function(){
						return instantiate(Class, arguments);
					};
				})(clazz);
			}
		}
		
		delete scope.moveTasksTo;
		newScope.moveTasksTo = arguments.callee;
		
		scope = newScope;
	})( scope );
	
})( this );