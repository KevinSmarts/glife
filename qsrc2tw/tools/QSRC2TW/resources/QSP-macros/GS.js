setup.qsp_gs_statistics ??= {};


setup.qsp_performAnal ??= {entries: []};
setup.qsp_performAnal_current ??= setup.qsp_performAnal;


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

	if(setup.Overwrite.gs(destination.toLowerCase(),destinationArgs) !== undefined)
		return;

	const oldScope = setup.qsp_performAnal_current;
	const myScope = {type:'gs',destination:destination,args:clone(destinationArgs),entries: []};
	oldScope.entries.push(myScope);
	setup.qsp_performAnal_current = myScope;

	State.variables.ARGSstack.push(destinationArgs);

	if(setup.userStyle?.logGS)
		console.log("GS",args,destination,destinationArgs,clone(State.variables.ARGSstack));


	setup.qsp_callStack.push({type:"gs",passage:destination,args:destinationArgs});

	var code = `<<include '${destination.toLowerCase()}'>>`;

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
		setup.qsp_performAnal_current = oldScope;
		State.variables.ARGSstack.pop();
		setup.qsp_callStack.pop();
		window.SweetCube.globalBreak = false;
	}

	setup.updateActions();

	const endTime = (new Date()).getTime();
	const executionTime = endTime - startTime;

	myScope.executionTime = executionTime;

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
