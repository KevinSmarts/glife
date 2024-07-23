# Getting Started

You need `node` and `npm` installed.

Navigate to `.\tools\QSRC2TW` and run `npm i` there. Do this in the current folder (`qsrc2tw`) as well.

# Changing the ANTLR-grammar

If you change the grammar of the parser, you have to recompile it. If you change the lexer, you have to recompile the lexer and then the parser. The commands to do so are present in the respective files.

You also need to recompile `QSPPARSER.js` by running `rpm run build` and update the version in `recources`.
