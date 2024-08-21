import qsrc2tw from "../qsrc2tw.js";

test('print', () => expect(qsrc2tw("'cla'")).toBe("<<=''>>cla<<=''>>"));
test('print', () => expect(qsrc2tw("*p 0")).toBe("<<=0>>"));

test('PL', () => expect(qsrc2tw("*pl 'cla'")).toBe("<<=''>>cla<<=''>><br/>"));
test('NL', () => expect(qsrc2tw("*NL 'cla'")).toBe("<br/><<=''>>cla<<=''>>"));

test('Empty PL', () => expect(qsrc2tw("*pl")).toBe("<br/>"));

test('Composed Print (example from wiki)', () => expect(qsrc2tw("*P '1'\n*PL '23'\n*NL '456'\n'78'")).toBe("<<=''>>1<<=''>>\n<<=''>>23<<=''>><br/>\n<br/><<=''>>456<<=''>>\n<<=''>>78<<=''>>"));