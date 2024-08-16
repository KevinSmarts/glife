
setup.startEditor = (domId, text) =>{
	setup.externalCodePromise('ace').then(()=>{
		const editor = ace.edit(domId);
		editor.setOption("showInvisibles", true);
		editor.setTheme("ace/theme/chrome");
		editor.session.setMode("ace/mode/html");
		editor.session.setUseWorker(false);
		editor.setValue(text);

		setup.editor = editor;
	});


}
