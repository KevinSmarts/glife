import qsrc2tw from "../qsrc2tw.js";

test('$lcase', () => expect(qsrc2tw("$c=$lcase('LOREM')")).toBe("<<set QSP.$c[0] = setup.qsp_lcase('LOREM')>>"));
test('len', () => expect(qsrc2tw("c=len('LOREM')")).toBe("<<set QSP.c[0] = setup.qsp_len('LOREM')>>"));
test('$mid', () => expect(qsrc2tw("$c=$mid('LOREM',1,2)")).toBe("<<set QSP.$c[0] = setup.qsp_mid('LOREM' , 1 , 2)>>"));
test('rand', () => expect(qsrc2tw("c=rand(1,5)")).toBe("<<set QSP.c[0] = setup.qsp_rand(1 , 5)>>"));
test('$trim', () => expect(qsrc2tw("$c=$trim('LOREM')")).toBe("<<set QSP.$c[0] = setup.qsp_trim('LOREM')>>"));
test('$ucase', () => expect(qsrc2tw("$c=$ucase('LOREM')")).toBe("<<set QSP.$c[0] = setup.qsp_ucase('LOREM')>>"));

test('Killvar', () => expect(qsrc2tw("killvar")).toBe("<<run setup.qsp_killvar()>>"));
test('Killvar S', () => expect(qsrc2tw("killvar '$deletedString'")).toBe("<<run setup.qsp_killvar('$deletedString')>>"));
test('Killvar S N', () => expect(qsrc2tw("killvar '$deletedString',123")).toBe("<<run setup.qsp_killvar('$deletedString' , 123)>>"));
