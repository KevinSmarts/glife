/// <reference path="../core/common/GameObject.ts" />



/**
 * You might need to update the path (first line of this file) and replace every mention of `Example` with your class name
 */
class Example extends GameObject{
    //#region SYSTEM
		constructor(){super()}

		clone = function () {
			return (new setup.Example())._init(this.clonableFields);
		};

		toJSON = function () {
			return JSON.reviveWrapper('(new setup.Example())._init($ReviveData$)', this.ownData);
		};
	//#endregion
}

setup.Example = Example;
