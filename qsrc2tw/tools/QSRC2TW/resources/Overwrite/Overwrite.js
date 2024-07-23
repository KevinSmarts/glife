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
    varGet(id,index){
        if(this._var[id] === undefined || this._var[id].get === undefined)
            return undefined;
        if(typeof this._var[id].get == "function")
            return this._var[id].get(index);
        if(Array.isArray(this._var[id].get) && typeof index == "number")
            return this._var[id].get[index];
        return this._var[id].get;
    }

    varSet(id,index,val){
        if(this._var[id] === undefined || this._var[id].set === undefined)
            return undefined;
        if(typeof this._var[id].set == "function")
            return this._var[id].set(index,val);
        console.error("Unsupported type for Overwrite.var.set (id,val)",id,val);
    }

    varRegister(id,get,set){
        this._var[id.toLowerCase()] = {get:get, set:set};
    }

}

setup.Overwrite = new Overwrite();
