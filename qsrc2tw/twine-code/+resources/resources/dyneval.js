setup.codeSanitize = (code) => {
    
    function varnameToTW(varname){
        varname = "QSP."+varname;
        if(varname.indexOf("[") == -1)
            varname += "[0]";
        return varname;
    }

    const regexp = /<<set QSP.*?\s*=\s*(.*?)>>/g;
    const matches = [...code.matchAll(regexp)];

    for(const match of matches){
        const completeMatch = match[0];
        let updatedMatch = completeMatch;
        const setValue = match[1];
        let updatedSetValue = setValue;

        const linkRegex = /<a\s+href\s*=\s*\"\s*exec\s*:(.*?)">(.*?)<\/a>/g;
        const linkMatches = [...setValue.matchAll(linkRegex)];

        for(const linkMatch of linkMatches){
            const completeLinkMatch = linkMatch[0];
            let updatedLink = completeLinkMatch;

            const commands = linkMatch[1];
            const label = linkMatch[2];
            const singleCommands = commands.split('&');

            const commandsOut = [];

            for(const singleCommand of singleCommands){
                let trimmed = singleCommand.trim();
                if (trimmed.startsWith('gt')){
                    const gtArguments = trimmed.substring(3);
                    commandsOut.push("<<gt "+gtArguments.replace(","," ").replaceAll("''","'")+">>");
                }else{
                    //$start_type[''loc''] = ''' + QSP.$ARGS[2] + '''
                    const setSplit = trimmed.split("=");
                    let varname = varnameToTW(setSplit[0].replaceAll("''","'"));
                    let val = setSplit[1].replaceAll("'''","''").replaceAll("[''","['").replaceAll("'']","']");
                    commandsOut.push("<<set "+varname+"="+val+">>");
                }
            }
            updatedLink = "<<link '"+label+"'>>" + commandsOut.join("")+ "<</link>>";
            //updatedMatch = updatedMatch.replace(completeLinkMatch,updatedLink);
            updatedSetValue = updatedSetValue.replace(completeLinkMatch,updatedLink);
        }

        //code = code.replace(completeMatch, "`"+ updatedMatch + "`");
        code = code.replace(setValue, "`"+ updatedSetValue + "`");
    }

    //code = code.replaceAll("QSP.$ARGS[","_dynevalVars[");

    
    /*
        <<if QSP.$ARGS[0] == QSP.$ARGS[2] && QSP.$ARGS[1] == QSP.$ARGS[3]>> 						<<set QSP.$result[0] = `'<TD><center><img src="images/system/icons/check.png" height="50"></center></TD>'`>> 					<<else>> 						<<set QSP.$result[0] = `'<TD><center><<link '<img src="images/system/icons/uncheck.png" height="50">'>><<set $start_type['loc'] = '' + QSP.$ARGS[2] + ''>><<set $start_type['magic'] = '' + QSP.$ARGS[3] + ''>><<gt 'begin' 'start'>><</link>></center></TD>'`>> 					<</if>>
    */

    return code;
}

setup.dyneval = function (code, ...margs){
    
    const resultBackupt = QSP.$result[0];

    State.variables.ARGSstack.push(margs);    

    //State.temporary.dynevalVars = margs;
    const saneCode = setup.codeSanitize(code);

    //const completeCode = "<<capture _dynevalVars>>"+saneCode+"<</capture>>";

    let completeCode = saneCode;

    for (let index = 0; index < margs.length; index++) {
        const varnamePlain = "QSP.$ARGS["+index+"]";
        const val = JSON.stringify(margs[index]);
        completeCode = completeCode.replaceAll(varnamePlain, val);    
    }

    console.log("CODE",completeCode);

    $.wiki(completeCode);

    State.variables.ARGSstack.pop();

    const result = QSP.$result[0];

    QSP.$result[0] = resultBackupt;

    return result;
}