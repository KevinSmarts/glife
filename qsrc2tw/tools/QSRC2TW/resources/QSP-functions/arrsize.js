setup.qsp_arrsize = (arrname) => {
    let varnameOfIntegers = arrname;
    if(arrname.startsWith('$'))
        varnameOfIntegers = varnameOfIntegers.substring(1);
    const varnameOfStrings = "$"+varnameOfIntegers;

    let result = 0;
    for(const lookupArrname of [varnameOfIntegers,varnameOfStrings]){
        const sourceVarname = setup.varname(lookupArrname);
        const sourceValue = State.getVar(sourceVarname) ?? [];
        result += sourceValue.length;
    }

    return result;
}
