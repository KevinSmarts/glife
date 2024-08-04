type NPC = NPCAccessor & {[key:string]:any};
class NPCAccessor{
    static _getHandler = function(target, prop){
		if(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(target), prop)?.get){
			return target[prop];
		}
		if(typeof target[prop] === 'function')
			return new Proxy(target[prop], {
				apply: (functionName, thisArg, argumentsList) =>  Reflect.apply(functionName, target, argumentsList)
			});

		return target.get(prop);
	}

    static handler = {
		get(target, prop) {
			if(prop.endsWith('_possessive')){
				prop = prop.replace('_possessive','');
				let value = NPCAccessor._getHandler(target,prop);
				if(value.endsWith('s'))
					return value+"'"; //https://dictionary.cambridge.org/grammar/british-grammar/possession-john-s-car-a-friend-of-mine
				return value + "'s";
			}
			return NPCAccessor._getHandler(target,prop);

		},
		set(target, prop, value, receiver){
			//console.warn(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(target), prop));
			if(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(target), prop)?.set){
				target[prop] = value;
				return true;
			}
			target.set(prop,value);
			return true;
		}
	};


    constructor(npcId=undefined){
		if(npcId)
			this._npcID = npcId;
	}

	_npcID: string;
    get id(){return this._npcID;}


    get(key:string,def:any=undefined){
        const NPCs = State.variables.npcs;
		return NPCs.get(this._npcID,key,def);
	}


	set(key:string,v:any){
        const NPCs = State.variables.npcs;
		return NPCs.set(this._npcID,key,v);
	}

    _init(nPCsDict){
        Object.keys(nPCsDict).forEach(function (pn) {
            this[pn] = clone(nPCsDict[pn]);
        }, this);

        return this;
    }

    clone = function () {
        return (new setup.NPCAccessor())._init(this);
    };

    toJSON = function () {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            if(typeof this[pn] !== "function")
                ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('(new setup.NPCAccessor())._init($ReviveData$)', ownData);
    };
}


setup.NPCAccessor = NPCAccessor;
