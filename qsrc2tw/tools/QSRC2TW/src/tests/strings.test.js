import qsrc2tw from "../qsrc2tw.js";

test("String: $c='A'+'B'", () => expect(qsrc2tw("$c='A'+'B'")).toBe("<<set QSP.$c[0] = 'A' + 'B'>>"));
test("String + Number: $c='A'+3", () => expect(qsrc2tw("$c='A'+3")).toBe("<<set QSP.$c[0] = 'A' + 3>>"));

test("Template String", () => expect(qsrc2tw(`'<center><img <<$set_imgh>> src="<<FUNC(''$purse_image'',	$currentpursetype, currentpursenumber)>>"></center>'`)).toBe(`<<='<center><img '+(QSP.$set_imgh[0])+' src=\"'+(setup.qsp_func('$purse_image' , QSP.$currentpursetype[0] , QSP.currentpursenumber[0]))+'\"></center>'>>`));

test("Simple Print", ()=>expect(qsrc2tw(`'Hallo'`)).toBe("<<=''>>Hallo<<=''>>"));
test("Simple Print DQ", ()=>expect(qsrc2tw(`"Hallo"`)).toBe("<<=''>>Hallo<<=''>>"));
test("Simple Print", ()=>expect(qsrc2tw(`'Hallo<<a>>'`)).toBe("<<='Hallo'+(QSP.a[0])+''>>"));
test("Templated Print", ()=>expect(qsrc2tw(`'Hallo<<a+"Aloha">>'`)).toBe(`<<='Hallo'+(QSP.a[0] + "Aloha")+''>>`));

test("Templated Print", ()=>expect(qsrc2tw(`'Hallo<<a+"Aloha<<someBS>>">>'`)).toBe(`<<='Hallo'+(QSP.a[0] + "Aloha"+(QSP.someBS[0])+"")+''>>`));

test("DQ", ()=>expect(qsrc2tw(`$train_station['city'] = "gt 'city_center'"`)).toBe(`<<set QSP.$train_station['city'] = "gt \\'city_center\\'">>`));
test("DQ", ()=>expect(qsrc2tw(`"'<<$ARGS[1]>>'"`)).toBe("<<=\"\\'\"+(QSP.$ARGS[1])+\"\\'\">>"));

test("DQ", ()=>expect(qsrc2tw(`'<a href="exec:gt ''popu'',''start2''"><<$ParrotQW[''Name2'']>></a> is sitting in his cage'`)).toBe("<<='<a href=\"exec:gt \\'popu\\',\\'start2\\'\">'+(QSP.$ParrotQW['Name2'])+'</a> is sitting in his cage'>>"));


test("Array", ()=>expect(qsrc2tw(`'Your mother''s name is <<$npc_firstname[''A29'']>> and'`)).toBe("<<='Your mother\\'s name is '+(QSP.$npc_firstname['A29'])+' and'>>"));

