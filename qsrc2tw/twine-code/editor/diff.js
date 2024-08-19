setup.placeDiffInDom = (title, oldContent, newContent, domSelector) => {
	setup.externalCodePromise('diff').then(()=>{

		const escapedChars = {
			/*'&' : '&amp;',
			'<' : '&lt;',
			'>' : '&gt;',*/
			'"' : '&quot;',
			"'" : '&#39;',
			'`' : '&#96;'
		};

		for(const [toBeEscaped, asEscaped] of Object.entries(escapedChars))
        	oldContent = oldContent.replaceAll(toBeEscaped,asEscaped);

		const unifiedDiffPatch = window.Diff.createTwoFilesPatch(title,title,oldContent,newContent,undefined,undefined,{ignoreWhitespace: true, stripTrailingCr: true});

		let resultingHTML = "";

		unifiedDiffPatch.split('\n').forEach((line)=>{
			if(line.startsWith('@@')){
				resultingHTML += `<p>${line}</p>`;
			}else if(line.startsWith('---')){
			}else if(line.startsWith('+++')){
			}else if(line.startsWith('-')){
				resultingHTML += `<p class="substraction">${line}</p>`;
			}else if(line.startsWith('+')){
				resultingHTML += `<p class="addition">${line}</p>`;
			}

		});

		$(domSelector).html(resultingHTML);
	});
}
