class Overwrite{

    _func = {};
    func(passage,args){
        passage = passage.toLowerCase();
        if(this._func[passage] === undefined)
            return undefined;
        if(typeof this._func[passage] == "function")
            return this._func[passage](args);
        return this._func[passage];
    }

    funcRegister(passage,code){
        this._func[passage.toLowerCase()] = code;
    }

    _gs = {};
    gs(passage,args){
        passage = passage.toLowerCase();
        if(this._gs[passage] === undefined)
            return undefined;
        if(typeof this._gs[passage] == "function")
            return this._gs[passage](args);
        return this._gs[passage];
    }

    gsRegister(passage,code){
        this._gs[passage.toLowerCase()] = code;
    }

    _var = {};
    _varByPrefix = {};
    varGet(id,index){
        let overwrite = null;

        for(const [prefix, ow] of Object.entries(this._varByPrefix)){
            if(id.startsWith(prefix)){

                overwrite = ow;
                if(typeof overwrite.get == "function")
                    return overwrite.get(id.substring(prefix.length),index);
                break;
            }else if(id.startsWith("$"+prefix)){

                overwrite = ow;
                if(typeof overwrite.get == "function")
                    return overwrite.get(id.substring(prefix.length+1),index);
                break;
            }
        }

        if(this._var[id] !== undefined && this._var[id].get !== undefined)
            overwrite = this._var[id];

        if(!overwrite)
            return undefined;

        if(typeof overwrite.get == "function")
            return overwrite.get(index);


        if(Array.isArray(overwrite.get) && typeof index == "number")
            return overwrite.get[index];
        return overwrite.get;
    }

    varSet(id,index,val){
        let overwrite = null;
        for(const [prefix, ow] of Object.entries(this._varByPrefix)){
            if(id.startsWith(prefix)){
                overwrite = ow;
                if(typeof overwrite.set == "function")
                    return overwrite.set(id.substring(prefix.length),index,val);
                break;
            }

            else if(id.startsWith("$"+prefix)){
                overwrite = ow;
                if(typeof overwrite.set == "function")
                    return overwrite.set(id.substring(prefix.length+1),index,val);
                break;
            }
        }


        if(this._var[id] === undefined || this._var[id].set === undefined)
            return undefined;
        if(typeof this._var[id].set == "function")
            return this._var[id].set(index,val);
        console.error("Unsupported type for Overwrite.var.set (id,val)",id,val);
    }

    varRegister(id,get,set){
        this._var[id.toLowerCase()] = {get:get, set:set};
    }

    varRegisterByPrefix(prefix,get,set){
        this._varByPrefix[prefix.toLowerCase()] = {get:get, set:set};
    }

}

setup.Overwrite = new Overwrite();
