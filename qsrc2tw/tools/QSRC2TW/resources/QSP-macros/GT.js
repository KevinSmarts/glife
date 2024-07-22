setup.qsp_gt = function(...args){
	const _recursion_limit = 5;

	setup.recursionCounterGT ??= [0,0];
	const recursionInterval = Math.floor(Date.now() / 500);
	if(setup.recursionCounterGT[0] < recursionInterval)
		setup.recursionCounterGT = [recursionInterval,0];
	setup.recursionCounterGT[1] += 1;
	if(setup.recursionCounterGT[1] > _recursion_limit){
		console.error('Recursion limit reached in GT: (args, here)',args,State.variables.here);
		return;
	}

	let destination = '';
	let destinationArgs = [];
	
	if(typeof args[0] == 'string'){
		destination = args[0];
		destinationArgs = args.slice(1);
	}else if(Array.isArray(args[0])){
		destination = args[0][0];
		destinationArgs = args[0].slice(1);
	}else{
		console.error(`Argument not reckognized in setup.gt()`,args[0]);
	}

	

	State.variables.ARGSstack = [destinationArgs];

	console.log("GT",args,destination,destinationArgs,State.variables.ARGSstack);

	//$.wiki(`<<goto '${destination.toLowerCase()}'>>`);
	Engine.play(destination.toLowerCase());
}

Macro.add('gt', {
	skipArgs : false,
	handler  : function () {
		try{
			setup.gt(...this.args);
		}
		catch (ex) {
			return this.error('ERROR in gt-widget: ' + ex.message);
		}
	}
});
