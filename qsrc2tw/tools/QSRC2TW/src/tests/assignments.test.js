import qsrc2tw from "../qsrc2tw.js";

test('Simple Number Assigment: n=10', () => expect(qsrc2tw("n=10")).toBe("<<set QSP.n[0] = 10>>"));
test('Addition Number Assigment: i=55+97', () => expect(qsrc2tw("i=55+97")).toBe("<<set QSP.i[0] = 55 + 97>>"));
test('Addition Number Assigment: i=1+2+3', () => expect(qsrc2tw("i=1+2+3")).toBe("<<set QSP.i[0] = 1 + 2 + 3>>"));

test('Compley Number Assigment: i=(1+2)*3', () => expect(qsrc2tw("i=(1+2)*3")).toBe("<<set QSP.i[0] = (1 + 2) * 3>>"));
test('Compley Number Assigment: i=1+(2*3)', () => expect(qsrc2tw("i=1+(2*3)")).toBe("<<set QSP.i[0] = 1 + (2 * 3)>>"));

test('Compley Division Number Assigment: i=(3/2)+(4/3)', () => expect(qsrc2tw("i=(3/2)+(4/3)")).toBe("<<set QSP.i[0] = (Math.floor(3 / 2)) + (Math.floor(4 / 3))>>"));

test('Var Number Assigment: b=a', () => expect(qsrc2tw("b=a")).toBe("<<set QSP.b[0] = QSP.a[0]>>"));
test('Var and Number Assigment: c=a+c', () => expect(qsrc2tw("c=a+c")).toBe("<<set QSP.c[0] = QSP.a[0] + QSP.c[0]>>"));

test('Inc Number: i+=1', () => expect(qsrc2tw("i+=1")).toBe("<<set QSP.i[0] += 1>>"));
test('Dec Number: i-=1', () => expect(qsrc2tw("i-=1")).toBe("<<set QSP.i[0] -= 1>>"));
test('Inc Number: i+=2+3', () => expect(qsrc2tw("i+=2+3")).toBe("<<set QSP.i[0] += 2 + 3>>"));


test('Set Number Array: i[1]=4', () => expect(qsrc2tw("i[1]=4")).toBe("<<set QSP.i[1] = 4>>"));
test('Set Number Array: i[1+2]=7', () => expect(qsrc2tw("i[1+2]=7")).toBe("<<set QSP.i[1 + 2] = 7>>"));



test('Set String: $anystring=\'Hello World\'', () => expect(qsrc2tw('$anystring=\'Hello World\'')).toBe("<<set QSP.$anystring[0] = 'Hello World'>>"));
test('Set String: $anystring=$someOtherString', () => expect(qsrc2tw('$anystring=$someOtherString')).toBe("<<set QSP.$anystring[0] = QSP.$someOtherString[0]>>"));

test("Set String: $anystring='Hello <<$name>>'", () => expect(qsrc2tw("$anystring='Hello <<$name>>'")).toBe("<<set QSP.$anystring[0] = 'Hello '+(QSP.$name[0])+''>>"));


test("Set Escaped String: $anystring='Hello Daniel''s World'", () => expect(qsrc2tw("$anystring='Hello Daniel''s World'")).toBe("<<set QSP.$anystring[0] = 'Hello Daniel\\'s World'>>"));