import qsrc2tw from "../qsrc2tw.js";

test('ifBlock', () => expect(qsrc2tw("if 0:\na=123\nend\n")).toBe("<<if 0>>\n\t<<set QSP.a[0] = 123>>\n<</if>>\n"));
test('ifBlockNested', () => expect(qsrc2tw("if 0:\nif 1:\na=123\nend\nend\n")).toBe("<<if 0>>\n\t<<if 1>>\n\t\t<<set QSP.a[0] = 123>>\n\t<</if>>\n\n<</if>>\n"));

test('ifLine', () => expect(qsrc2tw("if 0:a=123")).toBe("<<if 0>><<set QSP.a[0] = 123>><</if>>"));

test('ifElseBlock', () => expect(qsrc2tw("if 0:\na=123\nelse\nb=312\nend\n")).toBe("<<if 0>>\n\t<<set QSP.a[0] = 123>>\n<<else>>\n\t<<set QSP.b[0] = 312>>\n<</if>>\n"));