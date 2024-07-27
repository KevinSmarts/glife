class UserStyle{

	static #localStorageIdentifier = 'userStyle';
	static #domId = '#userConfiguredStyle';

	static fromLocalStorage(){
		const dataFromLocalStorage = localStorage.getItem(UserStyle.#localStorageIdentifier);
		if(!dataFromLocalStorage)
			return new UserStyle();
		return JSON.parse(dataFromLocalStorage);
	}

	constructor(){

	}

	saveToLocalStorage(){
		localStorage.setItem(UserStyle.#localStorageIdentifier,JSON.stringify(this));
	}

	update(){
		this.saveToLocalStorage();
		if($(UserStyle.#domId).length)
			$(UserStyle.#domId).text(this.css);

		if(this._grid && !this._gridIsCreated){
			setup.uiGridCreate();
			this._gridIsCreated = true;
		}
		else if(!this._grid && this._gridIsCreated){
			setup.uiGridDestroy();
			this._gridIsCreated = false;
		}
	}

	get css(){
		return `body{
					font-family:${this.font};
					font-size:${this.fontSize}px;
				}

				`+ this.toggleErrorsCSS + this.toggleNoticesCSS + this.gridCSS + this.customCSS;
	}

	_customCSS = '';
	get customCSS(){return this._customCSS;}
	set customCSS(v){
		this._customCSS = v;
		this.update();
	}

	_font = 'Helmet, Freesans, sans-serif';
	get font(){return this._font;}
	set font(v){
		this._font = v;
		this.update();
	}

	_fontSize = 16;
	get fontSize(){return this._fontSize;}
	set fontSize(v){
		this._fontSize = v;
		this.update();
	}

	_gridIsCreated = false;
	_grid = false;
	get grid(){return this._grid;}
	set grid(v){
		this._grid = v;
		this.update();
	}
	get gridCSS(){
		if(!this._grid)
			return ".grid-stack-item{display: contents;} #interface>div>*{overflow:auto}"
		return "";
	}

	_toggleErrors = false;
	get toggleErrors(){return this._toggleErrors;}
	set toggleErrors(v){
		this._toggleErrors = v;
		this.update();
	}
	get toggleErrorsCSS(){
		if(this._toggleErrors)
			return '';
		return '.error-view{display:none;}';
	}

	_toggleNotices = false;
	get toggleNotices(){return this._toggleNotices;}
	set toggleNotices(v){
		this._toggleNotices = v;
		this.update();
	}
	get toggleNoticesCSS(){
		if(this._toggleNotices)
			return '';
		return '.debugNotice{display:none;}';
	}


	//#region System
		_init(data){
			Object.keys(data).forEach(function (pn) {
				this[pn] = clone(data[pn]);
			}, this);

			return this;
		}

		clone = function () {
			return (new setup.UserStyle())._init(this);
		};

		toJSON = function () {
			var ownData = {};
			Object.keys(this).forEach(function (pn) {
				if(typeof this[pn] !== "function")
					ownData[pn] = clone(this[pn]);
			}, this);
			return JSON.reviveWrapper('(new setup.UserStyle())._init($ReviveData$)', ownData);
		};
	//#endregion

}

setup.UserStyle = UserStyle;
setup.userStyle = UserStyle.fromLocalStorage();

$(document).one(':storyready', function (ev) {
	//let userStyle = UserStyle.fromLocalStorage();
	setup.userStyle.update();
});
