import qsrc2tw from "../qsrc2tw.js";

test('cla', () => expect(
    qsrc2tw(`'<a href="exec:gt ''version''">Change log</a>'`))
    .toBe("<<=''>><a href=\"exec:gt 'version'\">Change log</a><<=''>>"));

test('cla', () => expect(
    qsrc2tw(`"<a href=""exec:gt 'version'"">Change log</a>"`))
    .toBe(`<<=''>><a href="exec:gt 'version'">Change log</a><<=''>>`));