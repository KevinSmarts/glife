setup.qsp_arrpos ??= (arrname,search,start=0) => {
    const sourceVarname = setup.varname(arrname);
    const sourceValue = State.getVar(sourceVarname) ?? [];
    return sourceValue.indexOf(search,start);
}