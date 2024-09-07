setup.variableStorageUsage = ()=>{
    let result = {};
    for(const [key,v] of Object.entries(State.variables)){
        if(!key.startsWith("QSPVAR"))
            continue;
        if(key.endsWith("_indexDict"))
            continue;
        let storageUsage = JSON.stringify(v).length;
        const idOfDict = key+"_indexDict";
        if(State.variables[idOfDict])
            storageUsage = JSON.stringify(State.variables[idOfDict]).length;
        result[key] = storageUsage;
    }

    result = Object.fromEntries(Object.entries(result).toSorted((a,b)=>b[1]-a[1]));
    return result;
}
