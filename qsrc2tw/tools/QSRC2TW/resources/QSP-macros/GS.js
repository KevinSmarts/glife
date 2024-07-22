setup.qsp_gs_statistics ??= {};
setup.qsp_gs_overwrite ??= {};

setup.qsp_gs = function(output,...args){
	const startTime = (new Date()).getTime();

	let destination = '';
	let destinationArgs = [];

	if(typeof args[0] == 'string'){
		destination = args[0];
		destinationArgs = args.slice(1);
	}else if(Array.isArray(args[0])){
		destination = args[0][0];
		destinationArgs = args[0].slice(1);
	}else{
		console.error(`Argument not reckognized in setup.gs()`,args[0]);
	}



	State.variables.ARGSstack.push(destinationArgs);

	if(setup.userStyle?.logGS)
		console.log("GS",args,destination,destinationArgs,clone(State.variables.ARGSstack));


	setup.qsp_callStack.push({type:"gs",passage:destination,args:destinationArgs});

	var code = `<<include '${destination.toLowerCase()}'>>`;
	if(typeof setup.qsp_gs_overwrite[destination.toLowerCase()] == "string")
		code = setup.qsp_gs_overwrite[destination.toLowerCase()];

	try{
		if(output)
			$(output).wiki(code);
		else if($(".passage").length)
			$(".passage").wiki(code);
		else{
			$.wiki(code);
		}
	}
	catch(e){
		console.error(e);
	}
	finally{
		State.variables.ARGSstack.pop();
		setup.qsp_callStack.pop();
	}

	setup.updateActions();

	const endTime = (new Date()).getTime();
	const executionTime = endTime - startTime;

	if(setup.userStyle?.logGS){
		setup.qsp_gs_statistics[destination.toLowerCase()] ??= [];
		setup.qsp_gs_statistics[destination.toLowerCase()].push({executionTime: executionTime,args:destinationArgs,callStack: clone(setup.qsp_callStack)});
	}
}

Macro.add('gs', {
	skipArgs : false,
	handler  : function () {
		try{
			setup.qsp_gs(this.output,...this.args[0]);
		}
		catch (ex) {
			return this.error('ERROR in gs-widget: ' + ex.message);
		}
	}
});
