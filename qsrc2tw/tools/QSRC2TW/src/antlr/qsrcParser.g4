// Run "antlr4 -Dlanguage=JavaScript -visitor qsrcParser.g4" if you update this file.

parser grammar qsrcParser;

options {
	tokenVocab = qsrcLexer;
}

passage:
	PassageIdentifier block PassageEndMarker (NEWLINE | comment)* EOF;



block: statementLine*;

statementLine: actBlock | commandLine | ifBlock | emptyLine;

emptyLine: NEWLINE;

actBlock:
	ACT value DPOINT NEWLINE block END commandAppended? commentAttached? NEWLINE;
actInline: ACT value actPicture? DPOINT command;
actPicture: Comma value;

ifInline:
	IF value DPOINT command (ELSE command)?;

ifBlock:
	IF value DPOINT NEWLINE block elseIfBlock* elseBlock? END commandAppended? commentAttached? NEWLINE;

elseIfBlock: ELSEIF value DPOINT NEWLINE block;
elseBlock: ELSE NEWLINE block;




command: 
	(
        (
			(ParenthesisLeft command ParenthesisRight)
			| addobj
			| assignment
			| copyarr 
			| delact
			| dynamic
			| gosub
			| gt
			| xgt
			| jump
			| jumpmarker
			| killvar
			| msg
			| opengame
			| play
			| print 
			| savegame 
			| syscall
			| syssetting
			| view
			| wait
		)
		commandAppended*
    )
	| actInline
	| comment
	| ifInline;
commandLine: command commandAppended? commentAttached? NEWLINE;

commandAppended: CommandConnect CommandConnect? command;

addobj: ADDOBJ value;

assignment: SET? (assignmentNumber | assignmentString);

assignmentNumber:
	identifierNumber assignmentoperator value;
assignmentString:
	identifierString assignmentoperator (value | multilineBlock);
    
assignmentoperator:
	EqualOperator
	| IncrementOperator
	| DecrementOperator
	| SetToOperator
	| MultSelfOperator
	| DivideSelfOperator;

comment: (EXCLAMATIONMARK ~NEWLINE*) | (CommentStart InComment*) | Multilinecomment;
commentAttached: AttachedComment InComment*;

copyarr: (COPYARR functionArguments) | (COPYARR ParenthesisLeft functionArguments ParenthesisRight);

delact: DELACT value;
dynamic: (DYNAMIC functionArguments)
	| (DYNAMIC ParenthesisLeft functionArguments ParenthesisRight);

gosub: GOSUB functionArguments;
gt: GOTO functionArguments;
xgt: XGOTO functionArguments;


jump: JUMP value;
jumpmarker: DPOINT WORD;

killvar: KILLVAR (value (Comma value)?)?;
msg: MSG value;
multilineBlock:
	BRACK_OPEN AnythingElseInMultiLine* innerMultilineBlock? BRACK_CLOSE;

innerMultilineBlock: multilineBlock AnythingElseInMultiLine*;
	
opengame: OPENGAME value?;

play: PLAY functionArguments;

print:
	printMain
	| printNewlineMain
	| printNewlinepreMain
	| printEmptyLineMain 
	| printSide
	| printNewlineSide
	| printNewlinepreSide
	| printEmptyLineSide;

printMain: value | (STAR Print value);
printNewlineMain: STAR PrintNewline value;
printNewlinepreMain: STAR PrintNewlinepre value;
printEmptyLineMain: STAR (PrintNewline | PrintNewlinepre);

printSide: Print value;
printNewlineSide: PrintNewline value;
printNewlinepreSide: PrintNewlinepre value;
printEmptyLineSide: (PrintNewline | PrintNewlinepre);

savegame: SAVEGAME value;

syscall: SYSCALL;
syssetting: SYSSETTING value;

view: VIEW value?;

wait: WAIT value;

identifier: identifierString | identifierNumber;
identifierNumber: WORD (arrayIndex)?;
identifierString: DOLLAR WORD (arrayIndex)?;
arrayIndex: (ARRAYBRACKOPEN value ARRAYBRACKCLOSE)
			| ARRAYBRACKOPEN ARRAYBRACKCLOSE;


compareOperator:
	GREAT_EQUAL_THAN
	| GREATER_THAN
	| LOWER_EQUAL_THAN
	| LOWER_THAN
	| EqualOperator
	| notEqual;

notEqual: NEQ | EXCLAMATIONMARK;


value:
	ParenthesisLeft value ParenthesisRight
	| numberLiteralWithOptionalSign
	| identifierNumber
	| INPUT value
	| invert value
	| functionWithNumberReturn
	| value numberOperator value 
	| value compareOperator value
	
	| escapedString
	| identifierString
	| functionWithStringReturn
	| multilineBlock
	| MINUS value;

numberLiteralWithOptionalSign : (PLUS|MINUS)? NumberLiteral;

functionWithNumberReturn:
	WORD ParenthesisLeft functionArguments ParenthesisRight;

invert: INVERT;
numberOperator: NEWLINE* (PLUS | MINUS | STAR | MOD | DIVIDE | AND | OR);


functionWithStringReturn: DOLLAR WORD ParenthesisLeft functionArguments ParenthesisRight;
functionArguments: value (Comma value)*;

escapedString:
	TemplateDoubleSingleQuote InEscapedStringAtom* TemplateDoubleSingleQuote 
	| SINGLEQUOTE stringAtom* stringTemplateVarSuffix* SINGLEQUOTE
	| DOUBLEQUOTE doubleQuoteAtom* stringDQTemplateVarSuffix* DOUBLEQUOTE
	 ;

stringAtom: (StringAtom | EscapedSingleQuote);
stringTemplateVar:
	TemplateStringStartExpression value TemplateStringEndExpression;
stringTemplateVarSuffix: stringTemplateVar stringAtom*;

doubleQuoteAtom: (DQStringAtom | EscapedDoubleQuote);
stringTemplateVarDQ:
	DQTemplateStringStartExpression value TemplateStringEndExpression;
stringDQTemplateVarSuffix: stringTemplateVarDQ doubleQuoteAtom*;