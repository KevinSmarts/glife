var actAdd = function(macroContext,label,contents,flags={}){

    contents = (flags.contents_header ?? '') + contents + (flags.contents_footer ?? '');

    State.temporary.actions ??= [];
    State.temporary.actions.push( new setup.Action(
        {
            passage: passage(),
            label: label,
            contents: contents,
            /*priority: _priority,
            captured: _capture_vars_actionBar,
            styleClass: _styleClass,
            tooltip: _tooltip,
            image: flags.image*/
        })
    );
}

Macro.add('act', {
	skipArgs : false,
	tags:[],
	handler  : function () {
		try {
	
			let label = this.args[0];
			let flags = this.args[1] ?? {};

			//flags.contents_header = '<<set _actions = []>><<replace ".passage">>';
			//flags.contents_footer = '<</replace>><<actionsRefresh>><<sidebarUpdate>>';

            flags.contents_header = '<<append ".passage">>';
            flags.contents_footer = "<<replace '#actions'>><<include 'Actions'>><</replace>><</append>>";

			actAdd(this,label,this.payload[0].contents,flags);
		}
		catch (ex) {
			return this.error('ERROR in act-widget: ' + ex.message);
		}
	}
});