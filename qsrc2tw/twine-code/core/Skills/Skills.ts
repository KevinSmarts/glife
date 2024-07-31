/// <reference path="../common/GameObject.ts" />

class Skills extends GameObject{


    static createProxy(skills:Skills):{[skillId:string]:Skill}{
        return new Proxy(skills, {
            get(skillsObject, skillId){
                if(typeof skillId != "string"){
					if(skillId == Symbol.toStringTag)
						return JSON.stringify(skillsObject);
                    throw new Error(`Unexpected symbol in Skills.Proxy.get(): '${skillId.toString()}'`);
                }

				if(!skillsObject._skills[skillId]){
					skillsObject._skills[skillId] = new Skill();
					skillsObject._skills[skillId].$skillExperienceGainCallback = (gain:number) => {skillsObject.$skillExperienceGainCallback(skillId,gain)};
				}
                return skillsObject._skills[skillId];
            },
			ownKeys(skillsObject) {
				return Object.keys(skillsObject._skills);
			},
        }) as unknown as {[skillId:string]:Skill};
    }

    _skills: {[skillID:string]: Skill} = {};

	set skillExperienceGainCallback(v: (skillId:string, gain:number) => any){
		this.$skillExperienceGainCallback = v;
		for(const [skillId, skill] of Object.entries(this._skills)){
			skill.$skillExperienceGainCallback = (gain:number) => {this.$skillExperienceGainCallback(skillId,gain)};
		}
	}
	$skillExperienceGainCallback: (skillId:string, gain:number) => any = (skillId:string, gain:number) => undefined;

    //#region SYSTEM
		constructor(
		){
			super();
		}

		clone = function () {
			return (new setup.Skills())._init(this.clonableFields);
		};

		toJSON = function () {
			return JSON.reviveWrapper('(new setup.Skills())._init($ReviveData$)', this.ownData);
		};
	//#endregion
}

setup.Skills = Skills;
