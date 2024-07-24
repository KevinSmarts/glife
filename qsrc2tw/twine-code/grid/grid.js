$(document).one(':passagedisplay', function (ev) {

	const layoutFromStorage = JSON.parse(localStorage.getItem("GridStack") ?? "{}");
	$('.grid-stack .grid-stack-item:visible').toArray().forEach((element,index) => {
		for(const [key,val] of Object.entries(layoutFromStorage[index] ?? {})){
			element.setAttribute(key,val);
		}
	});


    GridStack.init();

    let grid_stack = $('.grid-stack');

    grid_stack.on('change', function (event, items) {
		let r = {};
        $('.grid-stack .grid-stack-item:visible').toArray().forEach((element,index) => {
            r[index] ??= {};
			const attributes = element.attributes;
            for (let i = 0; i < attributes.length; i++) {
				const attr = attributes[i];

				if (attr.name.startsWith('gs')) {
					r[index][attr.name] = attr.value;
				}
			}
        });
		localStorage.setItem("GridStack", JSON.stringify(r));
    });
});
