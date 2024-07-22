setup.qsp_copyarr = (source,target,start=0,length=undefined) => {
    const sourceVarname = setup.varname(source);
    const sourceVarname_Dict = sourceVarname + "_indexDict";
    const targetVarname = setup.varname(target);
    const targetVarname_Dict = targetVarname + "_indexDict";

    if(!start){
        const sourceValue = State.getVar(sourceVarname) ?? [];
        const sourceValue_Dict = State.getVar(sourceVarname_Dict);

        State.setVar(targetVarname, sourceValue);
        if(sourceValue_Dict)
            State.setVar(targetVarname_Dict, sourceValue_Dict);
    }

    console.error("Not implemented: setup.copyarr() with start-parameter");
}