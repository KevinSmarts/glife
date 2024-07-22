import qsrc2tw from "../qsrc2tw.js";

test('Composed Assignment', () => expect(qsrc2tw("n=10 & clr")).toBe("<<set QSP.n[0] = 10>><<CLR>>"));

test('Composed Assignment', () => expect(qsrc2tw("$start_type['loc'] = 'sg' & $start_type['magic'] = 'nomagic' & gt 'begin','start'")).toBe("<<set QSP.$start_type['loc'] = 'sg'>><<set QSP.$start_type['magic'] = 'nomagic'>><<run setup.qsp_gt('begin' , 'start')>>"));