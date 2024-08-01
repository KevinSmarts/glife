/// <reference path="common/GameObject.ts" />


class PlayerCharacter extends GameObject{

	//#region Attributes, Proficiencies and Skills
		//#region Attributes
			private _attributes = new setup.Skills();
			public get attributes(){
				return this.attributesProxy;
			}

			private $attributesProxy:undefined|{[skillId:string]:Skill} = undefined;
			private get attributesProxy(){
				this.$attributesProxy ??= setup.Skills.createProxy(this._attributes);
				return this.$attributesProxy;
			}
		//#endregion

		//#region Proficiencies

			public get proficiencies(){
				return this.proficienciesProxy;
			}
			private $proficienciesProxy:undefined|{[skillId:string]:Skill} = undefined;
			private get proficienciesProxy(){
				const pc = this;
				this.$proficienciesProxy ??= new Proxy({}, {
					get(playerCharacter, proficiencyId){
						if(typeof proficiencyId != "string"){
							if(proficiencyId == Symbol.toStringTag)
								return "{}";
							throw new Error(`Unexpected symbol in Proficiencies.Proxy.get(): '${proficiencyId.toString()}'`);
						}

						try{
							if(setup.proficiencies[proficiencyId])
								return {level: setup.proficiencies[proficiencyId].calc(pc.attributes,pc.skills)};
						}
						catch(e){
							console.error(e);
						}
						return {level: 0};

					},
					ownKeys(playerCharacter) {
						return Object.keys(setup.proficiencies);
					},
				}) as unknown as {[proficiencyId:string]:Skill};
				return this.$proficienciesProxy;
			}

		//#endregion

		//#region Skills
			private _skills = new setup.Skills();
			public get skills(){
				return this.skillsProxy;
			}

			public skillEperienceGainCallback(skillId:string, gain:number){
				const attributeGainFactor = 0.2;
				const skillDefinition = setup.skills[skillId] ?? {attributes:[]};
				for(const attributeId of skillDefinition.attributes)
					this.attributes[attributeId].experience += gain * attributeGainFactor;
			}

			private $skillsProxy:undefined|{[skillId:string]:Skill} = undefined;
			private get skillsProxy(){
				this.$skillsProxy ??= setup.Skills.createProxy(this._skills);
				return this.$skillsProxy;
			}
		//#endregion
	//#endregion


    //#region SYSTEM
		constructor(){
			super();
			this._postInit();
		}

		_postInit(){
			this._skills.skillExperienceGainCallback = (skillId:string, gain:number) => this.skillEperienceGainCallback(skillId, gain);
		}

		clone = function () {
			return (new setup.PlayerCharacter())._init(this.clonableFields);
		};

		toJSON = function () {
			return JSON.reviveWrapper('(new setup.PlayerCharacter())._init($ReviveData$)', this.ownData);
		};
	//#endregion

}

setup.PlayerCharacter = PlayerCharacter;
