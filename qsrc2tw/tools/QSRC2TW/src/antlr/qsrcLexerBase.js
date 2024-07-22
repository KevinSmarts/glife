import antlr4 from 'antlr4';
import qsrcLexer from './qsrcLexer.js';

export default class qsrcLexerBase extends antlr4.Lexer {
    constructor(input) {
        super(input);
        this.currentDepth = 0;
        //this.templateDepthStack = new Array();
    }

    /*IsInTemplateString() {
        return this.templateDepthStack.length > 0 && this.templateDepthStack[this.templateDepthStack.length - 1] === this.currentDepth;
    }*/

    reset(){
        super.reset();
    }

    IsInTemplateString(){return this.currentDepth > 0;}

    ProcessTemplateOpen(){
        this.currentDepth++;
    }

    ProcessTemplateClose() {
        this.currentDepth--;
    }

    
}