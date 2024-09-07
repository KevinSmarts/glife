Macro.add('meter', {
	skipArgs : false,
	handler  : function () {
		try{
			const current = this.args[0];
			const min = this.args[1] ?? 0;
			const max = this.args[2] ?? 100;
			const options = this.args[3] ?? {};

			let colors:{start: number; color: string;}[] = options.colors ?? [];
			if(colors.length < 2)
				colors = [{start:0,color:'red'},{start:1,color:'green'}];
			const colorMode = options.colorMode ?? 'gradient';

			colors.sort((a,b)=>a.start-b.start);

			const currentPercentage = (current - min) / (max - min);

			let currentColor = 'black';
			if(currentPercentage < 0)
				currentColor = colors.first().color;
			else if(currentPercentage >= 1)
				currentColor = colors.last().color;
			else{
				switch (colorMode) {
					case 'gradient':
						const lower = colors.toReversed().find(element=>element.start<=currentPercentage) ?? {start:min, color: 'black'};
						const higher = colors.find(element=>element.start>currentPercentage) ?? {start: max, color: 'black'};
						const colorPercentage = (currentPercentage - lower.start) / (higher.start - lower.start);
						currentColor = `color-mix(in hsl, ${higher.color} ${Math.floor(colorPercentage*100)}%, ${lower.color})`;
					default:
						break;
				}
			}

			$(this.output).wiki(`<div class="meter" style="--percentage:${currentPercentage}"><div class="bar" style="background:${currentColor};"></div></div>`);

		}
		catch (ex) {
			return this.error('ERROR in meter-widget: ' + ex.message);
		}
	}
});



