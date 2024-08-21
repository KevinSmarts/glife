/// <reference path="../common/GameObject.ts" />
const maxLevel = 1000;

class Skill extends GameObject{
	$skillExperienceGainCallback: (gain:number) => any = (gain:number) => undefined;

	muta = 0;

	private get difficultyAdjustment(){return 60;}

	private _experience = 0;
	public get experience(){
		return this._experience;
	}
	public set experience(v:number){
		if(typeof v != "number")
			throw new Error(`Unexpected value for Skill.experience.set(): '${v}'`);
		const newExperience = Math.max(0,v);
		const gain = newExperience - this._experience;
		this.$skillExperienceGainCallback(gain);
		this._experience = newExperience;
	}


	public get level(){
		return this.experienceToLevel(this._experience);
	}
    public set level(v:number){
        this.experience = this.levelToExperience(v);
    }

	levelInitialize(level: number, overwrite = false){
		if(this._experience == 0 || overwrite)
			this._experience = this.levelToExperience(level);
	}

	private experienceRequiredForLevelN(n:number){
		if(!n)
			return 0;
		return Math.floor(73 / 2730 * this.difficultyAdjustment * n**2 + 1);

	}


	private experienceToLevel(exp:number){
		for(let i = 1; i<= maxLevel; i++){
			if(exp < this.experienceRequiredForLevelN(i))
				return i - 1;
		}
	}

	private levelToExperience(lvl:number){
		return this.experienceRequiredForLevelN(lvl);
	}

    //#region SYSTEM
		constructor(
		){
			super();
		}

		clone = function () {
			return (new setup.Skill())._init(this.clonableFields);
		};

		toJSON = function () {
			return JSON.reviveWrapper('(new setup.Skill())._init($ReviveData$)', this.ownData);
		};
	//#endregion
}

setup.Skill = Skill;
