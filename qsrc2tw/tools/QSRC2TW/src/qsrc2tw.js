import antlr4 from 'antlr4';
import qsrcLexer from './antlr/qsrcLexer.js';
import qsrcParser from './antlr/qsrcParser.js';
import QsrcVisitor from "./visitor/QsrcVisitor.js";
import Listener from './listener/Listener.js';


export default function qsrc2tw(input,isPassage=false){
    //const input = qspString+"\r";
	if(!isPassage)
    	input = "# SINGLELINECOMMAND\n"+input+"\n--- SINGLELINECOMMAND ---------------------------------\n";
	else
		input += "\n";
	const chars = new antlr4.InputStream(input);
	const lexer = new qsrcLexer(chars);
	const tokens = new antlr4.CommonTokenStream(lexer);
	const parser = new qsrcParser(tokens);
	const tree = parser.passage();

    const listener = new Listener();
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree);

	const output = new QsrcVisitor().visitPassage(tree, isPassage);

    return output;
}

