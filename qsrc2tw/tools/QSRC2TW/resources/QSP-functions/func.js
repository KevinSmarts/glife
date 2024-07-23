setup.qsp_func_statistics ??= {};
setup.qsp_callStack ??= [];

setup.qsp_func = (passage,...args) => {
    passage = passage.toLowerCase();

    let overwrittenResult = setup.Overwrite.func(passage,args);
    if(overwrittenResult !== undefined)
		return overwrittenResult;

    const startTime = (new Date()).getTime();

    const old$Result = QSP.$result[0];
    const oldResult = QSP.result[0];

	State.variables.ARGSstack.push(args);

    QSP.$result[0] = "";
    QSP.result[0] = 0;

    setup.qsp_callStack.push({type:"func",passage:passage,args:args});

	try{
		$.wiki(`<<include '${passage}'>>`);
	}
    catch(e){
        console.warn("FUNC ERROR",passage,e);
    }
	finally{
		State.variables.ARGSstack.pop();
        setup.qsp_callStack.pop();
	}

    const $result = QSP.$result[0];
    const result = QSP.result[0];

    QSP.$result[0] = old$Result;
    QSP.result[0] = oldResult;

    const endTime = (new Date()).getTime();
    const executionTime = endTime - startTime;

    if(setup.userStyle?.logFUNC){
        setup.qsp_func_statistics[passage] ??= [];
        setup.qsp_func_statistics[passage].push({
            executionTime: executionTime,
            args: args,
            callStack: clone(setup.qsp_callStack),
        });
    }

    if(result){
        if(setup.userStyle?.logFUNC)
            console.log("FUNC", passage, args, result);
        return result;

    }
    if(setup.userStyle?.logFUNC)
        console.log("$FUNC", passage,args, $result);
    return $result;
}
