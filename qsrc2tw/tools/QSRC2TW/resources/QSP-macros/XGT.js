Macro.add('xgt', {
	skipArgs : false,
	handler  : function () {
		try{
            State.temporary.actions = [];
			setup.qsp_gs(this.output,...this.args[0]);
		}
		catch (ex) {
			return this.error('ERROR in gs-widget: ' + ex.message);
		}
	}
});