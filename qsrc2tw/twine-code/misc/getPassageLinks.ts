const passageLinkMarkups:{[key:string]:{type:string, regex: RegExp}} = {
	'gs-macro': 	{type: 'gs',	regex: /<<gs\s+`\['([^']+)'[^\]]*\]`\s*>>/gd},
	'gt-function':	{type: 'gt',	regex: /setup\.qsp_gt\('([^']+)'[^\)]*\s*\)/gd},

	'goto':			{type: 'gt',	regex: /<<goto\s+'([^']+)'\s*>>/gd},
	'include':		{type: 'gs',	regex: /<<include\s+'([^']+)'\s*>>/gd},
};

setup.getPassageLinks = function(passageId:string){
	let result:{[passageId: string]: {type: string;line: number;}[];} = {};

	const passageCode = Story.get(passageId).text;

	for(const[key, markupSettings] of Object.entries(passageLinkMarkups)){
		const regex = markupSettings.regex;
		let regexMatch;
		while(regexMatch = regex.exec(passageCode)) {
			const passageId = regexMatch[1];
			result[passageId] ??= [];
			result[passageId].push({line:-1, type: markupSettings.type});
		}
	}

	return result;
}

setup.getPassageLinksToPassage = function(passageId:string){
	function anyPassageLinkMarkupMatches(text:string):boolean{
		for(const[key, markupSettings] of Object.entries(passageLinkMarkups)){
			let regexMatch;
			while(regexMatch = markupSettings.regex.exec(text))
				if(regexMatch[1] == passageId)
					return true;
		}
		return false;
	}

	return Story.lookupWith(function(p){return anyPassageLinkMarkupMatches(p.text)}).map((passage)=>passage.title);

}
