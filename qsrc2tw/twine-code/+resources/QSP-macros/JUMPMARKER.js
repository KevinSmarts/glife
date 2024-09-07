setup.console = window.console;

Macro.add('JUMPMARKER', {
	skipArgs : false,
	handler  : function () {
		try{
            //setup.console.log("JM", this);
			const markerId = this.args[0];
            const myCommand = this.source;
            let me = this;
            while(me.parent != null && me.parent.parser.source.indexOf(myCommand) >= 0)
                me = me.parent;

            const completeContext = me.parser.source;
            
            let codeAfterJumpMarker = completeContext.substring(completeContext.indexOf(myCommand)+myCommand.length);

            const countOpeningIfs = (codeAfterJumpMarker.match(/<<if\s+/g) || []).length;
            const countClosingIfs = (codeAfterJumpMarker.match(/<<\/if>>/g) || []).length;
            codeAfterJumpMarker = "<<if true>>".repeat(countClosingIfs-countOpeningIfs)+ codeAfterJumpMarker;

            State.temporary.jumpmarkers ??= {};
            State.temporary.jumpmarkers[markerId] = codeAfterJumpMarker;
			          
			console.log("JUMPMARKER",markerId, State.temporary.jumpmarkers[markerId]);

		}
		catch (ex) {
			return this.error('ERROR in JUMPMARKER-widget: ' + ex.message);
		}
	}
});

setup.qsp_jump_statistics ??= {};

Macro.add('JUMP', {
	skipArgs : false,
	handler  : function () {
		try{
            const startTime = (new Date()).getTime();

			const markerId = this.args[0];
            const jumpId = this.args[1];    //Required to correctly identify ourselves

            let codeToExecute = "";
            if(!State.temporary.jumpmarkers[markerId]){
                //The Jumpmarker is not known. This means that it might appear later in the code. Good thing we don't have a way to skip to there >:-(
                console.warn('Unreckognized Jump Marker: "'+markerId+'"');
                return;
            }
            
            codeToExecute = State.temporary.jumpmarkers[markerId];

            if(setup.userStyle?.logJUMP)
                console.log("JUMP",markerId,jumpId,codeToExecute,clone(State.temporary.jumpmarkers));
            const myCommand = this.source;
            const positionOfThisMacro = codeToExecute.indexOf(myCommand);

            if(positionOfThisMacro == -1){
                console.warn("JUMPING ahead is not allowed! Create an if-statement instead!", markerId);
                return;
            }

            codeToExecute = codeToExecute.substring(0,positionOfThisMacro+myCommand.length); // Cut off anything after the jump-command
            
            const countOpeningIfs = (codeToExecute.match(/<<if\s+/g) || []).length;
            const countClosingIfs = (codeToExecute.match(/<<\/if>>/g) || []).length;

            codeToExecute += "<</if>>".repeat(countOpeningIfs-countClosingIfs);
            //console.log("JUMP",markerId,jumpId,codeToExecute);
            
            $(this.output).wiki(codeToExecute);

            const endTime = (new Date()).getTime();
            const executionTime = endTime - startTime;

            const statisticsId = `${markerId}_${jumpId}`;

            if(setup.userStyle?.logJUMP){
                setup.qsp_jump_statistics[statisticsId] ??= [];
                setup.qsp_jump_statistics[statisticsId].push({executionTime: executionTime,callStack: clone(setup.qsp_callStack)});
            }
		}
		catch (ex) {
			return this.error('ERROR in JUMP-widget: ' + ex.message);
		}
	}
});