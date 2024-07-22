
setup.qsp_dyneval = (code, ...args) => {

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

    setup.qsp_callStack.push({type:"dyneval",code:codeParsed});

    try{
	    $.wiki(codeParsed);
    }
    finally{
        State.variables.ARGSstack.pop();
        setup.qsp_callStack.pop();
    }

    const $result = QSP.$result[0];
    const result = QSP.result[0];

    QSP.$result[0] = old$Result;
    QSP.result[0] = oldResult;
	
	

    if(result){
        //console.log("DYNEVAL", codeParsed, result);
        return result;

    }
    //console.log("DYNEVAL", codeParsed, $result);
    return $result;

};