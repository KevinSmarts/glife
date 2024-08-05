$(document).one(':storyready', ()=> {
    const version = setup.version;
    State.variables.version ??= version;
    State.variables.versionHistory ??= [version];
    if(State.variables.version != version){
        State.variables.versionHistory.push(version);
    }
	console.log("Running version",version);
});
