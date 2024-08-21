setup.attributes = [
	'stren',
	'agil',
	'vital',
	'intel',
	'react',
	'sprt',
	'chrsm',
	'prcptn',
	'magik',
	'stren_plus',
	'butt_tr',
]
setup.proficiencies ??= {};
setup.skills ??= {};
setup.skills = Object.assign({
	jab:			{attributes:[]},
	punch:			{attributes:[]},
	kick:			{attributes:[]},
	def:			{attributes:[]},
	shoot:			{attributes:[]},
	vokal:			{attributes:[]},
	sewng:			{attributes:[]},
	instrmusic:		{attributes:[]},
	photoskl:		{attributes:[]},
	artskls:		{attributes:[]},
	danc:			{attributes:[]},
	dancero:		{attributes:[]},
	dancpol:		{attributes:[]},
	chess:			{attributes:[]},
	gaming:			{attributes:[]},
	humint:			{attributes:[]},
	persuas:		{attributes:[]},
	run:			{attributes:[]},
	vball:			{attributes:[]},
	icesktng:		{attributes:[]},
	wrstlng:		{attributes:[]},
	ftbll:			{attributes:[]},
	splcstng:		{attributes:[]},
	observ:			{attributes:[]},
	makupskl:		{attributes:[]},
	compskl:		{attributes:[]},
	comphckng:		{attributes:[]},
	hndiwrk:		{attributes:[]},
	servng:			{attributes:[]},
	mdlng:			{attributes:[]},
	medcn:			{attributes:[]},
	heels:			{attributes:[]},
	pool:			{attributes:[]},
	inhib:			{attributes:[]},
	perform:		{attributes:[]},
	bushcraft:		{attributes:[]},
	cleaning:		{attributes:[]},
	bkbll:			{attributes:[]},
	cheer:			{attributes:[]},
	musicprod:		{attributes:[]},
	songwrit:		{attributes:[]},
},setup.skills);

for(const skillName of Object.keys(setup.skills)){

	setup.Overwrite.varRegister(
		skillName+"_lvl",
		(index)=>State.variables.PC.skills[skillName].level,
		(index,val:number)=>State.variables.PC.skills[skillName].level=val
	);

	setup.Overwrite.varRegister(
		skillName+"_exp",
		(index)=>State.variables.PC.skills[skillName].experience,
		(index,val:number)=>State.variables.PC.skills[skillName].experience=val
	);

	setup.Overwrite.varRegister(
		"pcs_"+skillName,
		(index)=>window.QSP['attsklupdate'][0] == 1 ? Math.floor(State.variables.PC.proficiencies[skillName].level) : (State.variables["QSPVAR_n_pcs_"+skillName]?.[index ?? 0] ?? 0),
		(index,val:number)=>State.variables["QSPVAR_n_pcs_"+skillName] = [val],
	);

}

for(const attributeId of setup.attributes){

	setup.Overwrite.varRegister(
		attributeId+"_lvl",
		(index)=>State.variables.PC.attributes[attributeId].level,
		(index,val:number)=>State.variables.PC.attributes[attributeId].level=val
	);

	setup.Overwrite.varRegister(
		attributeId+"_exp",
		(index)=>State.variables.PC.attributes[attributeId].experience,
		(index,val:number)=>State.variables.PC.attributes[attributeId].experience=val
	);

	setup.Overwrite.varRegister(
		"pcs_"+attributeId,
		(index)=>window.QSP['attsklupdate'][0] == 1 ? State.variables.PC.attributes[attributeId].level : (State.variables["QSPVAR_n_pcs_"+attributeId]?.[index ?? 0] ?? 0),
		(index,val:number)=>State.variables["QSPVAR_n_pcs_"+attributeId] = [val],
	);

}
