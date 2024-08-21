class NPCs{
    npc(npcId:string):NPC{
		return new Proxy(new NPCAccessor(npcId),NPCAccessor.handler);
	}

    get(npcId:string,field:string,def:any=undefined):any{
		let data = this.npcData(npcId);

		if(field in data)
			return data[field];
		/*if("passage" in data){
			let resultFromPassage = setup.func(data.passage,'vars',field);
			if(resultFromPassage)
				return resultFromPassage;
		}*/



        return def;
    }

    getDynamicData(npcId:string){
        return State.variables.npcDynamic[npcId] ?? {};
    }

    getStaticData(npcId:string){
        return setup.npcStatic[npcId] ?? {};
    }

    npcData(npcId:string){
        let staticData = this.getStaticData(npcId);
        let dynamicData = this.getDynamicData(npcId);

        let data = Object.assign({},staticData,dynamicData);

        /*if("gender" in data)
            data = Object.assign({},setup.npcDefaults.gender[data.gender],data); //Apply the gender-defaults first.
        if("defaults" in data){
            for(let defaultId of data.defaults){
                let def = setup.npcDefaults[defaultId];
                data = Object.assign({},def,data);  //Apply the defaults first. They could be overwritten by static or dynamic data
            }
        }*/
        return data;
    }

    set(npcId:string,field:string,v:any){
        State.variables.npcDynamic[npcId] ??= {};

        /*if(field in npcFieldBoundaries){
            let fieldRules = npcFieldBoundaries[field];
            if("min" in fieldRules)
                v = Math.max(v, fieldRules.min);
            if("max" in fieldRules)
                v = Math.min(v, fieldRules.max);
        }*/

        State.variables.npcDynamic[npcId][field] = v;



        console.log("NPC value set",npcId,field,v);
    }

    //#region System
		constructor(){}

		_init(nPCsDict){
			Object.keys(nPCsDict).forEach(function (pn) {
				this[pn] = clone(nPCsDict[pn]);
			}, this);

			return this;
		}

		clone = function () {
			return (new setup.NPCs())._init(this);
		};

		toJSON = function () {
			var ownData = {};
			Object.keys(this).forEach(function (pn) {
				if(typeof this[pn] !== "function")
					ownData[pn] = clone(this[pn]);
			}, this);
			return JSON.reviveWrapper('(new setup.NPCs())._init($ReviveData$)', ownData);
		};
	//#endregion
}

setup.NPCs = NPCs;
