Macro.add('image', {
	skipArgs : false,
	handler  : function () {
		try{
			$(this.output).wiki(`<img src="images/${this.args[0]}"/>`);
		}
		catch (ex) {
			return this.error('ERROR in JUMPMARKER-widget: ' + ex.message);
		}
	}
});
