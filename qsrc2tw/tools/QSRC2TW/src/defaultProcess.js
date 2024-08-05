import qsrc2tw from "./qsrc2tw.js";

export default function defaultProcess(code){
    let twineCode = qsrc2tw(code, true);

    var regexResult;
    var twineCodeTemp;

    twineCode = twineCode.replaceAll("<<=''>>","");

    const imageRegex = /<<='(?:<center>)?<img (?:'\+\(QSP\.\$set_imgh\[0\]\)\+' )?src="([\w\s/]+\.jpg)">(?:<\/center>)?'>>/gi;
    twineCodeTemp = twineCode;
    while(regexResult = imageRegex.exec(twineCode)) {
        twineCodeTemp = twineCodeTemp.replace(regexResult[0],`<<image '${regexResult[1]}'>>`);
    }
    twineCode = twineCodeTemp;


    const headlineRegex = /(\s)<center>(?:<[^>]+>)*<font[^>]*color[^>]*maroon[^>]*>([^<]+)<\/font>(?:<[^>]+>)*<\/center>/gi;
    twineCodeTemp = twineCode;
    while(regexResult = headlineRegex.exec(twineCode)) {
        twineCodeTemp = twineCodeTemp.replace(regexResult[0],`${regexResult[1]}<h2>${regexResult[2]}</h2>`);
    }
    twineCode = twineCodeTemp;


    return twineCode;
}
