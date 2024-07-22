import qsrc2tw from "../qsrc2tw.js";

test('comment', () => expect(qsrc2tw("gs 'passage' & ! This include 'passage'")).toBe("<<gs `['passage']`>>"));
test('comment', () => expect(qsrc2tw(`!!use with - <img <<$set_imgh>> src="<<func(''$face_image'')>>">`)).toBe("<!-- !!use with - <img <<$set_imgh>> src=\"<<func(''$face_image'')>>\"> -->"));



