Macro.add('autocomplete', {
	skipArgs : false,
    tags: [],
	handler  : function () {
		try{

            const varname = this.args[0];
            const domID = `autoComplete_${varname.replaceAll("$","--")}`;
            const tags = this.args[1];

            const innerCode = this.payload[0].contents;

            $(this.output).wiki(`<<id '${domID}'>><<textbox "${varname}" "">><</id>>`);

            $(document).one(':passagedisplay', function (ev) {
                setup.externalCodePromise('jQueryUI').then(function () {
                    $(`#${domID}`).autocomplete({
                        source: tags,
                        select: (event, ui) => {
                            const v = ui.item.value;
                            State.setVar(varname,v);
                            $.wiki(innerCode);
                        }
                    });

                });
            });
		}
		catch (ex) {
			return this.error('ERROR in gt-widget: ' + ex.message);
		}
	}
});



