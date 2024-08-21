import qsrc2tw from "../qsrc2tw.js";

test('cla', () => expect(qsrc2tw("cla")).toBe("<<CLA>>"));
test('clr', () => expect(qsrc2tw("clr")).toBe("<<CLR>>"));
test('*clr', () => expect(qsrc2tw("*clr")).toBe("<<STAR_CLR>>"));

test('showstat', () => expect(qsrc2tw("showstat 1")).toBe("<<SHOWSTAT 1>>"));