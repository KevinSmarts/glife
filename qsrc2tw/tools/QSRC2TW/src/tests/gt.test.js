import qsrc2tw from "../qsrc2tw.js";

test('gs', () => expect(qsrc2tw("gs 'passage'")).toBe("<<gs `['passage']`>>"));
test('gs n', () => expect(qsrc2tw("gs 'passage',900")).toBe("<<gs `['passage' , 900]`>>"));
test('gs s', () => expect(qsrc2tw("gs 'passage','arg0'")).toBe("<<gs `['passage' , 'arg0']`>>"));
test('gs $s', () => expect(qsrc2tw("gs 'passage',$arg0")).toBe("<<gs `['passage' , QSP.$arg0[0]]`>>"));

test('gt', () => expect(qsrc2tw("gt 'passage'")).toBe("<<run setup.qsp_gt('passage')>>"));
test('gt n', () => expect(qsrc2tw("gt 'passage',900")).toBe("<<run setup.qsp_gt('passage' , 900)>>"));
test('gt s', () => expect(qsrc2tw("gt 'passage','arg0'")).toBe("<<run setup.qsp_gt('passage' , 'arg0')>>"));
test('gt $s', () => expect(qsrc2tw("gt 'passage',$arg0")).toBe("<<run setup.qsp_gt('passage' , QSP.$arg0[0])>>"));