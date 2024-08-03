setup.qsp_copyarr = (target,source,start=0,length=undefined) => {
    const sourceVarname = setup.varname(source);
    const sourceVarname_Dict = sourceVarname + "_indexDict";
    const targetVarname = setup.varname(target);
    const targetVarname_Dict = targetVarname + "_indexDict";

    const sourceValue = State.getVar(sourceVarname) ?? [];
    const sourceValue_Dict = State.getVar(sourceVarname_Dict);

    length ??= sourceValue.length;

    const slicedSourceValue = sourceValue.slice(start,start + length);

    State.setVar(targetVarname, slicedSourceValue);
    if(sourceValue_Dict){
        const slicedDictValue = sourceValue_Dict.slice(start,start + length);
        State.setVar(targetVarname_Dict, slicedDictValue);
    }
}
