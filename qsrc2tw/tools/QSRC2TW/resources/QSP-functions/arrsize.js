setup.qsp_arrsize = (arrname) => {
    const sourceVarname = setup.varname(arrname);
    const sourceValue = State.getVar(sourceVarname) ?? [];
    return sourceValue.length;
}