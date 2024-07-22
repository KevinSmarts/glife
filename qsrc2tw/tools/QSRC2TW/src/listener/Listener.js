import qsrcParserListener from "../antlr/qsrcParserListener.js";


export default class Listener extends qsrcParserListener{
    /*enterEveryRule(ctx){
        throw new Error(ctx.toString());
    }*/

    visitErrorNode(node){
        //throw new Error(node.toString());
        throw new Error(node.getText());
    };
}