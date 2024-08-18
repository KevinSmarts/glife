//Don't forget to add the d-flag to your regex! It's needed for the use of indices.
function splitByRegex(text,regex, callback){
	let result = [];

	let regexResult;
	let previousEndIndex;
	let previousRegexResult;

	while(regexResult = regex.exec(text))
	{
        let thisEndIndex = regexResult.indices[0][1];
        let thisStartIndex = regexResult.indices[0][0];
        if(previousEndIndex){
            const previousCodeSegment = text.substring(previousEndIndex,thisStartIndex);
			result.push(callback(previousRegexResult,previousCodeSegment));

        }

        previousRegexResult = regexResult;
        previousEndIndex = thisEndIndex;
	}


	let thisStartIndex = text.length;
	const previousCodeSegment = text.substring(previousEndIndex,thisStartIndex);
	result.push(callback(previousRegexResult,previousCodeSegment));

	return result;
}

function stripPrefixFromObjectKeys(obj, prefix){
	return Object.fromEntries(Object.entries(obj).map(([key,val]) => {
		if(key.startsWith(prefix) && key.length > prefix.length)
			return [key.substring(prefix.length),val];
		return [key,val];
	}));
}

export default function wardrobeItems(code,options){
	let firstLine = code.split("\n")[0];
	let twCode = firstLine.replace("#","::")+`\n`;

	const itemIdPrefix = firstLine.trim().replace("# $attributes_","");

	let tsCode = "setup.wardrobeStatic ??= {};\n";

	const propertyRegex = /^\s*(\w+)\s*=\s*(\d+)\s*$/gm;
	const stringPropertyRegex = /^\s*\$(\w+)\s*=\s*('|")(.*?)\2\s*$/gm;

	const itemData = splitByRegex(code, /(?:else)?if\s+args\[1\]\s*=\s*(\d+):/gmid,
		(regexResult,code) => {
			const itemId = `${itemIdPrefix}_${regexResult[1]}`;

			let properties = {};
			let propertyRegexResult;
			while(propertyRegexResult = propertyRegex.exec(code))
				properties[propertyRegexResult[1]] = Number(propertyRegexResult[2]);
			while(propertyRegexResult = stringPropertyRegex.exec(code))
				properties[propertyRegexResult[1]] = propertyRegexResult[3];

			if(properties['CloQuality'])
				properties = Object.assign({type:'clothes'},stripPrefixFromObjectKeys(properties,'Clo'));
			else if(properties['ShoQuality'])
				properties = Object.assign({type:'shoes'},stripPrefixFromObjectKeys(properties,'Sho'));
			else if(properties['BraQuality'])
				properties = Object.assign({type:'bra'},stripPrefixFromObjectKeys(properties,'Bra'));
			else if(properties['PanQuality'])
				properties = Object.assign({type:'bra'},stripPrefixFromObjectKeys(properties,'Pan'));
			else if(properties['CoatQuality'])
				properties = Object.assign({type:'coat'},stripPrefixFromObjectKeys(properties,'Coat'));

			if(options.shop)
				properties.shop = options.shop;

			return `setup.wardrobeStatic['${itemId}'] = ${JSON.stringify(properties)}\n`

		});
	tsCode += itemData.join("");

	return [twCode,tsCode];
}
