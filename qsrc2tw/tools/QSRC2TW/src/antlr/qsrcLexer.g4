// Run "antlr4 -Dlanguage=JavaScript -visitor qsrcLexer.g4" if you update this file. You'll need to re-compile the parser as well (see there).

/*
Done:
	ACT
	AND
	CLA
	CLEAR
	*CLEAR
	CLOSE
	CLR
	*CLR
	CLS
	OR
	P
	*P
	PL
	*PL
TODO:
	ADDLIB
	ADDOBJ
	ADDQST

	ARRCOMP
	ARRPOS
	ARRSIZE
	$BACKIMAGE
	BCOLOR

	CMDCLEAR
	CMDCLR
	COPYARR
	$COUNTER
	COUNTOBJ
	$CURACTS
	CURLOC
	DEBUG
	DELACT
	DELLIB
	DELOBJ
	DESC
	DISABLESCROLL
	DISABLESUBEX
	DYNAMIC
	DYNEVAL
	ELSE
	ELSEIF
	EXIT
	FCOLOR
	$FNAME
	FREELIB
	FSIZE
	FUNC
	GETOBJ
	GOSUB
	GOTO
	GS
	GT
	IF
	IIF
	INCLIB
	INPUT
	INSTR
	ISNUM
	ISPLAY
	JUMP
	KILLALL
	KILLOBJ
	KILLQST
	KILLVAR
	LCASE
	LCOLOR
	LEN
	LET
	LOC
	$MAINTXT
	MAX
	MENU
	MID
	MIN
	MOD
	MSECSCOUNT
	MSG
	NL
	*NL
	NO
	NOSAVE
	OBJ
	$ONACTSEL
	$ONGLOAD
	$ONGSAVE
	$ONNEWLOC
	$ONOBJADD
	$ONOBJDEL
	$ONOBJSEL
	OPENGAME
	OPENQST


	PLAY
	QSPVER
	RAND
	REFINT
	REPLACE
	RGB
	RND
	SAVEGAME
	SELACT
	SELOBJ
	SET
	SETTIMER
	SHOWACTS
	SHOWINPUT
	SHOWOBJS
	SHOWSTAT
	$STATTXT
	STR
	STRCOMP
	STRFIND
	STRPOS
	TRIM
	UCASE
	UNSEL
	UNSELECT
	USEHTML
	$USERCOM
	USER_TEXT
	USRTXT
	VAL
	VIEW
	WAIT
	XGOTO
	XGT
 */

lexer grammar qsrcLexer;

options {
	superClass = qsrcLexerBase;
}

PassageIdentifier: '#' ' '* DOLLAR? WORD NEWLINE;
PassageEndMarker:
	'---' ' '+ DOLLAR? WORD ' '+ '--------------' '-'* NEWLINE*;

SYSCALL: (C L A) | (STAR? C L E A R) | (C L O S E) | (STAR? C L R) | (C L S) | (C M D C L E A R) | (C M D C L R) | (C L O S E ' ' A L L) | (E X I T) | (K I L L A L L);
SYSSETTING: (S H O W S T A T)
	| (S H O W O B J S)
	| (S H O W I N P U T)
	| (S H O W A C T S);

ADDOBJ: A D D O B J;

COPYARR: C O P Y A R R;
DELACT: D E L A C T;
DYNAMIC: D Y N A M I C;


GOSUB: (G S) | (G O S U B);
GOTO: (G T) | (G O T O);
XGOTO: X GOTO;

INPUT: '$'? I N P U T;

JUMP: J U M P;

KILLVAR: K I L L V A R;
MSG: M S G;
OPENGAME: O P E N G A M E;
PLAY: P L A Y;
Print: P;
PrintNewline: P L;
PrintNewlinepre: N L;
SAVEGAME: S A V E G A M E;
VIEW: V I E W;
WAIT: W A I T;
//PrintSidebar: STAR P;
//PrintNewlineSidebar: STAR P L;
//PrintNewlinepreSidebar: STAR N L;

ACT: A C T;
IF: I F;
ELSEIF: E L S E I F;
ELSE: E L S E DPOINT?;
END: E N D;

INVERT: N O;
AND: A N D;
OR: O R;

CommandConnect: '&';

NumberLiteral : [0-9]+;

SET: S E T;
EqualOperator: '=';
IncrementOperator: '+=';
DecrementOperator: '-=';
DivideSelfOperator: '/=';
MultSelfOperator: '*=';
SetToOperator: 'to';

TemplateStringEndExpression:
	{this.IsInTemplateString()}? '>>' {this.ProcessTemplateClose();} -> popMode;

DOUBLEQUOTE: '"' -> pushMode(inDQString);
SINGLEQUOTE: '\'' -> pushMode(InString);
TemplateDoubleSingleQuote:{this.IsInTemplateString()}? '\'\'' ->pushMode(InEscapedString);

MOD: M O D;

fragment LOWERCASE: [a-z];
fragment UPPERCASE: [A-Z];
WORD: (LOWERCASE | UPPERCASE | '_') (
		LOWERCASE
		| UPPERCASE
		| '_'
		| [0-9]
	)*;

fragment A: ('A' | 'a');
fragment B: ('B' | 'b');
fragment C: ('C' | 'c');
fragment D: ('D' | 'd');
fragment E: ('E' | 'e');
fragment F: ('F' | 'f');
fragment G: ('G' | 'g');
fragment H: ('H' | 'h');
fragment I: ('I' | 'i');
fragment J: ('J' | 'j');
fragment K: ('K' | 'k');
fragment L: ('L' | 'l');
fragment M: ('M' | 'm');
fragment N: ('N' | 'n');
fragment O: ('O' | 'o');
fragment P: ('P' | 'p');
fragment R: ('R' | 'r');
fragment S: ('S' | 's');
fragment T: ('T' | 't');
fragment U: ('U' | 'u');
fragment V: ('V' | 'v');
fragment W: ('W' | 'w');
fragment X: ('X' | 'x');
fragment Y: ('Y' | 'y');
fragment Z: ('Z' | 'z');
STAR: '*';

DPOINT: ':';

PLUS: '+';
MINUS: '-';
DIVIDE: '/';


GREATER_THAN: '>';
GREAT_EQUAL_THAN: '>=' | '=>';
LOWER_THAN : '<';
LOWER_EQUAL_THAN: '<=' | '=<';
NEQ: '<>';



DOLLAR: '$';
EXCLAMATIONMARK: '!';
CommentStart: '!!' -> pushMode (COMMENT);
AttachedComment: '&' ' '* '!' -> pushMode(COMMENT);
Multilinecomment: '!!' WHITESPACE? '{' .*? '}';

ARRAYBRACKOPEN: '[';
ARRAYBRACKCLOSE: ']';
BRACK_OPEN: '{' -> pushMode(MultiLine);
ParenthesisLeft: '(';
ParenthesisRight: ')';

Comma: ',';
Questionmark: '?';

NEWLINE: ('\r'? '\n' | '\r')+;

WHITESPACE: (' ' | '	')+ -> skip;

LINEBREAK: '_' WHITESPACE* NEWLINE -> skip;

AnythingElse: .;

mode InString;

EscapedSingleQuote: '\'\'';

TemplateStringStartExpression:
	'<<' {this.ProcessTemplateOpen();} -> pushMode(DEFAULT_MODE);

SINGLEQUOTEINSIDE: '\'' -> type(SINGLEQUOTE), popMode;
StringAtom: ~'\'';

mode inDQString;
EscapedDoubleQuote: '""';

DOUBLEQUOTEINSIDE: '"' -> type(DOUBLEQUOTE), popMode;
DQTemplateStringStartExpression:
	'<<' {this.ProcessTemplateOpen();} -> pushMode(DEFAULT_MODE);
DQStringAtom: ~'"';

mode InEscapedString;

DoubleSINGLEQUOTEINSIDE:
	'\'\'' -> type(TemplateDoubleSingleQuote), popMode;

InEscapedStringAtom: .;

mode MultiLine;

BRACK_OPEN_INSIDE:
	'{' -> type(BRACK_OPEN), pushMode(MultiLine);
BRACK_CLOSE: '}' -> popMode;

AnythingElseInMultiLine: .;

mode COMMENT;
COMMENNEWLINE: ('\r'? '\n' | '\r')+ -> type(NEWLINE), popMode;
InComment: .;
