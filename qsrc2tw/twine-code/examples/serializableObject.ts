class Example{
    //#region SYSTEM
		constructor(){}

		_init(playerCharacter: { [x: string]: any; }){
			Object.keys(playerCharacter).forEach(function (pn) {
				this[pn] = clone(playerCharacter[pn]);
			}, this);

			return this;
		}

		clone = function () {
			return (new setup.Example())._init(this);
		};

		toJSON = function () {
			var ownData = {};
			Object.keys(this).forEach(function (pn) {
				if(typeof this[pn] !== "function")
					ownData[pn] = clone(this[pn]);
			}, this);
			return JSON.reviveWrapper('(new setup.Example())._init($ReviveData$)', ownData);
		};
	//#endregion
}

setup.Example = Example;
