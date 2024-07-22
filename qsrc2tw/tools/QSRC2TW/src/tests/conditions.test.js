import qsrc2tw from "../qsrc2tw.js";

test('Equals', () => expect(qsrc2tw("c=1 = 0")).toBe("<<set QSP.c[0] = 1 == 0>>"));
test('GT', () => expect(qsrc2tw("c=1 > 0")).toBe("<<set QSP.c[0] = 1 > 0>>"));
test('GTE', () => expect(qsrc2tw("c=3 >= 4")).toBe("<<set QSP.c[0] = 3 >= 4>>"));
test('LT', () => expect(qsrc2tw("c=1 < 0")).toBe("<<set QSP.c[0] = 1 < 0>>"));
test('LTE', () => expect(qsrc2tw("c=3 <= 4")).toBe("<<set QSP.c[0] = 3 <= 4>>"));
test('NEQ', () => expect(qsrc2tw("c=3 <> 4")).toBe("<<set QSP.c[0] = 3 != 4>>"));
test('NEQ', () => expect(qsrc2tw("c=3 ! 4")).toBe("<<set QSP.c[0] = 3 != 4>>"));

test('NO', () => expect(qsrc2tw("c=NO 3")).toBe("<<set QSP.c[0] = setup.logic_not(3)>>"));

test('AND', () => expect(qsrc2tw("c=(2=2) and (3=2)")).toBe("<<set QSP.c[0] = (2 == 2) && (3 == 2)>>"));

test('mod', () => expect(qsrc2tw(`if (year mod 400 = 0):\nresult = 29\nend`)).toBe("<<if (QSP.year[0] % 400 == 0)>>\n\t<<set QSP.result[0] = 29>>\n<</if>>\n"));
test('complexCondition', () => expect(qsrc2tw(`if ((year mod 4 = 0) and (year mod 100 ! 0)) or (year mod 400 = 0):\nresult = 29\nelse\nresult = 28\nend`)).toBe("<<if ((QSP.year[0] % 4 == 0) && (QSP.year[0] % 100 != 0)) || (QSP.year[0] % 400 == 0)>>\n\t<<set QSP.result[0] = 29>>\n<<else>>\n\t<<set QSP.result[0] = 28>>\n<</if>>\n"));