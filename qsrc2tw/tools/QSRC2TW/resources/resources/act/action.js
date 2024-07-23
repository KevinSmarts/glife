class Action{

	label = 'Label missing';
	styleClass = 'action';
	passage = '';
	priority = 0;
	contents = '';

	captured = {};

	constructor(settings={}){
		Object.keys(settings).forEach(function (pn) {
			this[pn] = clone(settings[pn]);
		}, this);
	}

	execute(){
		for (const [capturedKey, capturedValue] of Object.entries(this.captured)) {
			State.setVar(capturedKey,capturedValue);
		}
		$.wiki(this.contents);
	}

	//#region System
		_init(action){
			Object.keys(action).forEach(function (pn) {
				this[pn] = clone(action[pn]);
			}, this);

			return this;
		}

		clone = function () {
			return (new setup.Action())._init(this);
		};

		toJSON = function () {
			var ownData = {};
			Object.keys(this).forEach(function (pn) {
				if(typeof this[pn] !== "function")
					ownData[pn] = clone(this[pn]);
			}, this);
			return JSON.reviveWrapper('(new setup.Action())._init($ReviveData$)', ownData);
		};
	//#endregion
}

setup.Action ??= Action;