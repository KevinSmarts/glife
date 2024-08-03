setup.CURRENT_ARGS = function(emptyValue){ return new Proxy({}, {
    get(target, prop, receiver) {
        const index = parseInt(prop);
        const argsSet = State.variables.ARGSstack.last();
        //console.log("ARGS GET",prop,argsSet);
        if(argsSet.length > index && typeof emptyValue == typeof argsSet[index])
            return argsSet[index];
        return emptyValue;
    },
    set(target, prop, val) {
        const index = parseInt(prop);
        const argsSet = State.variables.ARGSstack.last();
        while(argsSet.length <= index)
            argsSet.push(emptyValue);
        argsSet[index] = val;
        return true;
    },

});
}

setup.qsp_killvar = (vname, index=-1) => {
    try{
        const varname = setup.varname(vname);
        const dictname = varname+"_indexDict";

        if(index == -1){
            // DELETE ALL
            State.setVar(varname,[]);
            if(State.getVar(dictname))
                State.setVar(dictname,[]);
        }else if(typeof index == "number"){
            if(State.getVar(varname))
                State.setVar(varname,State.getVar(varname).toSpliced(index, 1));
            if(State.getVar(dictname))
                State.setVar(dictname,State.getVar(dictname).toSpliced(index, 1));
        }else if(typeof index == "string"){
            let indexOfindex = -1;
            if(State.getVar(dictname))
                indexOfindex = State.getVar(dictname).indexOf(index);
            if(indexOfindex == -1)
                return;
            return setup.qsp_killvar(vname, indexOfindex);

        }else{
            console.error("Type mismatch in qsp_killvar. Expected number|string, received",typeof index);
        }
    }catch(e){
        console.error("ERROR in qsp_killvar:",e);
    }



}

setup.varname = (qspVarname) => {
    const isString = qspVarname.startsWith('$');
    if(qspVarname.startsWith("$QSPVAR_"))
        console.error("Recursive Variable Access:",qspVarname);
    const varname = "$QSPVAR_"+ (isString ? 's_' : 'n_') + qspVarname;
    return varname;
}

window.QSP = new Proxy({},{
    get(target, prop, receiver) {
        prop = prop.toLowerCase();
        if(prop == "args")
            return setup.CURRENT_ARGS(0);
        if(prop == "$args")
            return setup.CURRENT_ARGS("");

        const isString = prop.startsWith('$');
        const varname = setup.varname(prop);
        var value = State.getVar(varname);

        return new Proxy({},{
            get(target2, prop2, receiver2) {
                let overwrittenVar;
                if(((overwrittenVar = setup.Overwrite.varGet(prop, prop2)) !== undefined))
                    return overwrittenVar;

                if(value == undefined)
                    return isString ? '' : 0;
                const prop2AsNumber = Number(prop2);
                if(Number.isInteger(prop2AsNumber)){
                    if(Array.isArray(value) && value.length > prop2AsNumber){
                        return value[parseInt(prop2AsNumber)];
                    }
                }
                else{
                    const indexDictName = varname+"_indexDict";
                    const indexDict = State.getVar(indexDictName) ?? [];
                    let index = indexDict.findIndex(entry=>entry==prop2);
                    if(index == -1){
                        return isString ? '' : 0;
                    }
                    return value[index];
                }
                return isString ? '' : 0;

            },
            set(obj2, prop2, value2) {
                if(setup.Overwrite.varSet(prop, prop2, value2) !== undefined)
                    return true;

                if(value == undefined){
                    value = [];
                }
                if(value2 === true)
                    value2 = 1;
                if(value2 === false)
                    value2 = 0;

                //Insert this as a new value at the end of the array. Used where QSP would do it with `arr[] = "new value"`
                if(prop2 == -1){
                    prop2 = value.length;
                }

                if(setup.userStyle?.logAssignments)
                    console.log("SET",prop,prop2,value2,clone(setup.qsp_callStack));

                const prop2AsNumber = Number(prop2);
                let updateIndex = -1;
                const indexDictName = varname+"_indexDict";
                let indexDict = State.getVar(indexDictName);
                if(Number.isInteger(prop2AsNumber) && !indexDict){
                    while(value.length <= prop2AsNumber)
                        value.push(isString ? '' : 0);
                    updateIndex = prop2;
                }
                else{
                    indexDict ??= [];
                    let index = indexDict.findIndex(entry=>entry==prop2);
                    if(index == -1){
                        index = indexDict.length;
                        indexDict.push(prop2);
                        State.setVar(indexDictName, indexDict);
                    }
                    updateIndex = index;
                }

                value[updateIndex] = value2;
                State.setVar(varname,value);

                return true;
            },
        });
    },
});
