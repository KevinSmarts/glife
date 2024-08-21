import qsrc2tw from "../qsrc2tw.js";

test('actBlock', () => expect(qsrc2tw("act 'Lalala':\na=123\nend\n")).toBe("<<act 'Lalala'>>\n\t<<set QSP.a[0] = 123>>\n<</act>>\n"));

test('actInline', () => expect(qsrc2tw("act 'Lalala':a=123")).toBe("<<act 'Lalala'>><<set QSP.a[0] = 123>><</act>>"));
