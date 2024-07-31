export default function skillDefinitions(code){
    let firstLine = code.split("\n")[0];
    let twCode = firstLine.replace("#","::")+`\n<<run console.warn("Use of skillDefinitions-passages is deprecated (${firstLine})")>>`;

    let tsCode = "setup.skills ??= {};\n";

    const attributeRegex = /\$att_name\[(\d+)\] = '(\w+)'/gd;

    const attributes = [];

    let result;
    while(result = attributeRegex.exec(code)) {
        attributes[Number(result[1])] = result[2];
    }


    const skilToAttributeEffectRegex = /(\w+)\[1\]\s*=\s*(\d)(?:\s*&\s*\1\[\d+\]\s*=\s*(\d+))*/gd;
    while(result = skilToAttributeEffectRegex.exec(code)) {
        const skillId = result[1];
        const arrayIndizes = result[0].split("&").map((singleCommand)=>attributes[Number(singleCommand.split("=")[1].trim())]);
        tsCode += `setup.skills['${skillId}'] = {attributes:${JSON.stringify(arrayIndizes)}}\n`;
    }

    tsCode += "setup.proficiencies ??= {};\n"
    //const proficiencyRegex = /pcs_(\w+)\s*=\s*([^&]*)/gd;
    const proficiencyRegex = /^\s*pcs_(\w+)\s*=\s*([^&^\n]*)([^\n]*)\s*$/gm;
    const proficiencyInnerRegex = /(?:pcs_(\w+))|(?:(\w+)_lvl)|([a-z]\w*)/gd;

    while(result = proficiencyRegex.exec(code)) {
        const proficiencyId = result[1];

        if(attributes.indexOf(proficiencyId) != -1)
            continue;

        const proficiencyCodeRaw = result[2];
        let proficiencyCode = proficiencyCodeRaw;

        let innerResult;
        while(innerResult = proficiencyInnerRegex.exec(proficiencyCodeRaw)) {
            const attributeOrSkillId = innerResult[1] ?? innerResult[2];
            if(attributes.indexOf(attributeOrSkillId) != -1)
                proficiencyCode = proficiencyCode.replace(innerResult[0],`attributes['${attributeOrSkillId}'].level`);
            else if(innerResult[3])
                proficiencyCode = proficiencyCode.replace(innerResult[3],"0");
            else
                proficiencyCode = proficiencyCode.replace(innerResult[0],`skills['${attributeOrSkillId}'].level`);

        }

        tsCode += `setup.proficiencies['${proficiencyId}'] = {calc:(attributes,skills)=>${proficiencyCode}}\n`;
    }


    return [twCode, tsCode];
}
