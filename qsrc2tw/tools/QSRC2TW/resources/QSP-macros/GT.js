/*
	This script replicates the functionality of the GT-statement in QSP.

	In QSP, you can have several jumps in a row after each user-input without a hazzle.
	That's not the case in SugarCube.
	Since the first passage doesn't stop rendering when the second one is called the output is scrambled.
	For the user, that usually looks like a black- or whitescreen.

	To solve this issue, gt-commands are only excecuted once a passage is completely rendered.
	To achieve that, they get queued in `pendingGTs` and called on the `:passageend`-event.
*/


/**
 * Indicates the number of currently running gt-commands.
 * Gets reset to 0 on the `:passageend`-event.
 * Since multiple running gt-events are to be avoided, a number bigger than 1 indicates a bug.
 * @type {number}
 */
let gtExecutionCounter = 0;


/**
 * The queued gt-events (FIFO). One entry is the array of arguments the gt-command has to be executed with.
 * @type {(string|number)[]}
 */
const pendingGTs = [];


/** Execute the next gt-command from `pendingGTs` if the queue is not empty. */
const executeNextPendingGT = ()=>{
	if(!pendingGTs.length)
		return;
	const nextPendingGT = pendingGTs.shift();
	setup.qsp_gt(...nextPendingGT);
}

$(document).on(':passageend', function (ev) {
	gtExecutionCounter = 0;
	executeNextPendingGT();
});





setup.qsp_gt = function(...args){
	if(++gtExecutionCounter > 1){
		pendingGTs.push(args);
		return;
	}

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
