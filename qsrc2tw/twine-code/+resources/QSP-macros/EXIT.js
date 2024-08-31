Macro.add('EXIT', {
	skipArgs : true,
	handler  : function () {
		try{
			window.SweetCube.globalBreak = true;
		}
		catch (ex) {
			return this.error('ERROR in EXIT-widget: ' + ex.message);
		}
	}
});

/*$(document).on(':passagestart', function (ev) {
    window.SweetCube.globalBreak = false;
});*/
$(document).on(':passagerender', function (ev) {
    window.SweetCube.globalBreak = false;
});
/*$(document).on(':passagedisplay', function (ev) {
    window.SweetCube.globalBreak = false;
});*/
