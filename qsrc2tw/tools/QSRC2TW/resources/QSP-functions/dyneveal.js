
setup.qsp_dyneval = (code, ...args) => {

    const startTime = (new Date()).getTime();

    code = code.replaceAll('###NL###','\n').replaceAll("\t","\n")+"\n";

    let codeParsed = "";
    try{
        codeParsed = setup.qsrc2tw(code);
    }
    catch(e){
        console.error("Failed to execute code:",code.replaceAll("\n","*NL*"),e);
    }

    const old$Result = QSP.$result[0];
    const oldResult = QSP.result[0];

    QSP.$result[0] = "";
    QSP.result[0] = 0;

    State.variables.ARGSstack.push(args);

    const oldScope = setup.qsp_performAnal_current;
	const myScope = {type:'dyneval',code:codeParsed,args:clone(args),entries: []};
	oldScope.entries.push(myScope);
	setup.qsp_performAnal_current = myScope;

    setup.qsp_callStack.push({type:"dyneval",code:codeParsed});

    try{
	    $.wiki(codeParsed);
    }
    finally{
        setup.qsp_performAnal_current = oldScope;
        State.variables.ARGSstack.pop();
        setup.qsp_callStack.pop();
    }

    const $result = QSP.$result[0];
    const result = QSP.result[0];

    QSP.$result[0] = old$Result;
    QSP.result[0] = oldResult;

    const endTime = (new Date()).getTime();
    const executionTime = endTime - startTime;
    myScope.executionTime = executionTime;


    if(result){
        //console.log("DYNEVAL", codeParsed, result);
        return result;

    }
    //console.log("DYNEVAL", codeParsed, $result);
    return $result;

};
