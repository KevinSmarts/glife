for(const varname of ["$lcolor","$fcolor","$bcolor"])
	setup.Overwrite.varRegister(varname,undefined,((index,val)=>{setup.updateUIUserSettings(); return undefined;}));

setup.updateUIUserSettings = () => {
	$(document).one(':passagedisplay', function (ev) {
		let css = `
				#passages,
				#sidebar{
					background:${QSP.$bcolor[0]};
					color:${QSP.$fcolor[0]};
				}
				#passages a,
				#sidebar a{
					color:${QSP.$lcolor[0]};
				}`;

		if(!QSP.SHOWSTAT[0]) css += `
			#sidebar{
				display: none;
			}
		`;

		if(!QSP.SHOWACTS[0]) css += `
			#actions{
				display: none;
			}
		`;
		$("#qspStyles").html(css);
	});
}

setup.updateUIUserSettings();
