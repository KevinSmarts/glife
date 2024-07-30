import qsrc2tw from "./qsrc2tw.js";

export default function npcInit(code){
    let firstLine = code.split("\n")[0];
    let twCode = firstLine.replace("#","::")+`\n<<run console.warn("Use of npcInit-passages is deprecated (${firstLine})")>>`;

    let tsCode = "setup.npcStatic ??= {};\n";

    let npcIDs = [];
    const npcStartRegex = /npctemp\s*=\s*(\d+)/gd;
    let result;
    let previousEndIndex = 0;
    let previousNPCId = 0;

    let remainingQsrc = "";
    while(result = npcStartRegex.exec(code)) {
        const npcId = result[1];
        npcIDs.push("A"+npcId);
        let thisEndIndex = result.indices[0][1];
        let thisStartIndex = result.indices[0][0];
        if(previousEndIndex){
            const [npcObj, remainingCode] = parseNpcInitCommand(code,previousEndIndex,thisStartIndex);
            tsCode += `setup.npcStatic['A${previousNPCId}'] = ${npcObj}\n\n`;
            remainingQsrc += remainingCode+"\n";
        }

        previousNPCId = npcId;
        previousEndIndex = thisEndIndex;

    }

    let thisStartIndex = code.length;
    const [npcObj, remainingCode] = parseNpcInitCommand(code,previousEndIndex,thisStartIndex);
    tsCode += `setup.npcStatic['A${previousNPCId}'] = ${npcObj}\n\n`;
    remainingQsrc += remainingCode;

    //twCode += qsrc2tw(remainingQsrc,false);

    return [twCode, tsCode];
}

function parseNpcInitCommand(code, startIndex, endIndex){
    const npcCode = code.substring(startIndex,endIndex);
    let npc = {_defaults:[]};

    let codeThatNeedInitialization = [];

    const fieldRegex = /\$?npc_(\w*)\['A<<npctemp>>'\]\s*=\s*(.*)/g;
    let result;
    while(result = fieldRegex.exec(npcCode)){
        let field = result[1];
        let val = result[2];
        const valAsNumber = Number(val);
        if(Number.isInteger(valAsNumber))
            val = valAsNumber;
        else if(val.length > 1 && val.startsWith("'") && val.endsWith("'")){
            val = val.substring(1,val.length-1).replaceAll("''","'");
            if(val.indexOf("<<") != -1){
                codeThatNeedInitialization.push(result[0]);
                continue;
            }
        }
        else{ // Most likely a variable name or a function call.
            //field = "$"+field;
            codeThatNeedInitialization.push(result[0]);
            continue;
        }

        npc[field] = val;

    }

    const defaultsRegex = /gs\s+'npcstaticdefaults'\s*,\s*'(.+)'/g;
    while(result = defaultsRegex.exec(npcCode))
        npc._defaults.push(result[1].replaceAll("'","").replaceAll(" ","").replaceAll(",","_"));

    return [JSON.stringify(npc),codeThatNeedInitialization.join('\n')];
}
