import qsrcParserVisitor from "../antlr/qsrcParserVisitor.js";

export default class QsrcVisitor extends qsrcParserVisitor{

    jumpCounter = 0;

    visitActBlock(ctx,indent=0){
        const indentString = "\t".repeat(indent);
        var label = ctx.value();
        let result = `${indentString}<<act ${this.visitValue(label)}>>\n`

        result += this.visitBlock(ctx.block(),indent+1);

        result += `\n${indentString}<</act>>\n`;

        return result;
    }

    visitAnyValue(ctx){
        if(ctx.value()) return this.visitValue(ctx.value());
        if(ctx.value()) return this.visitValue(ctx.value());
    }

    visitArrayIndex(ctx){
        if(ctx.value()) return `[${this.visitValue(ctx.value())}]`;
        return "[-1]";
    }

    visitAssignment(ctx){
        if(ctx.assignmentNumber()) return this.visitAssignmentNumber(ctx.assignmentNumber());
        if(ctx.assignmentString()) return this.visitAssignmentString(ctx.assignmentString());
    }

    visitAssignmentNumber(ctx){
        return `<<set ${this.visitIdentifierNumber(ctx.identifierNumber())} ${this.visitAssignmentoperator(ctx.assignmentoperator())} ${this.visitValue(ctx.value())}>>`;
    }

    visitAssignmentString(ctx){
        if(ctx.value())
            return `<<set ${this.visitIdentifierString(ctx.identifierString())} ${this.visitAssignmentoperator(ctx.assignmentoperator())} ${this.visitValue(ctx.value())}>>`;
        var assignmentValue = ctx.multilineBlock().getText().trim().slice(1,-1).replaceAll(/(\r? \n)|\n/gi,'###NL###');
        return `<<set ${this.visitIdentifierString(ctx.identifierString())} ${this.visitAssignmentoperator(ctx.assignmentoperator())} \`${assignmentValue}\`>>`
    }

    visitAssignmentoperator(ctx){
        switch(ctx.getText()){
            case 'to':
            case '=': return '=';
            case '+=': return '+=';
            case '-=': return '-=';
            case '*=': return '*=';
            case '/=': return '/=';
        }
    }

    visitBlock(ctx,indent = 0){
        let result = [];
        for(let i = 0; ctx.statementLine(i) != null; i++){
            result.push(
                this.visitStatementLine(
                    ctx.statementLine(i),indent
                )
            );
        }

        if(!result.length)
            return "";
        return result.join("\n");
    }

    visitCommand(ctx){
        if(ctx.actInline()) return `<<act ${this.visitValue(ctx.actInline().value())}>>${this.visitCommand(ctx.actInline().command())}<</act>>` ;
        if(ctx.comment()) return `<!-- ${ctx.comment().getText()} -->`;
        if(ctx.ifInline()) return this.visitIfInline(ctx.ifInline());

        var result = "";
        if(ctx.ParenthesisLeft()) result = `(${this.visitCommand(ctx.command(0))})`;
        else if(ctx.addobj()) result = `<<run setup.qsp_addobj(${this.visitValue(ctx.addobj().value())})>>`;
        else if(ctx.assignment()) result = this.visitAssignment(ctx.assignment());
        else if(ctx.copyarr()) result = `<<run setup.qsp_copyarr(${this.visitFunctionArguments(ctx.copyarr().functionArguments())})>>`;
        else if(ctx.delact()) result = `<<run setup.qsp_delact(${this.visitValue(ctx.delact().value())})>>`;
        else if(ctx.dynamic()) result = this.visitDynamic(ctx.dynamic());
        else if(ctx.gosub()) result = `<<gs \`[${this.visitFunctionArguments(ctx.gosub().functionArguments())}]\`>>`;
        else if(ctx.gt()) result = `<<run setup.qsp_gt(${this.visitFunctionArguments(ctx.gt().functionArguments())})>>`;
        else if(ctx.xgt()) result = `<<xgt \`[${this.visitFunctionArguments(ctx.xgt().functionArguments())}]\`>>`;
        else if(ctx.jump()) result = this.visitJump(ctx.jump());
        else if(ctx.jumpmarker()) result = this.visitJumpmarker(ctx.jumpmarker());
        else if(ctx.killvar()) result = this.visitKillvar(ctx.killvar());
        else if(ctx.msg()) result = this.visitMsg(ctx.msg());
        else if(ctx.play()) result = `<<run setup.qsp_play(${this.visitFunctionArguments(ctx.play().functionArguments())})>>`;
        else if(ctx.print()) result = this.visitPrint(ctx.print());
        else if(ctx.savegame()) result = `<<run setup.qsp_savegame(${this.visitValue(ctx.savegame().value())})>>`;
        else if(ctx.syscall()) result = this.visitSyscall(ctx.syscall());
        else if(ctx.syssetting()) result = this.visitSyssetting(ctx.syssetting());
        else if(ctx.view()) result = ctx.view().value() ? `<<view ${this.visitValue(ctx.view().value())}>>` : "<<view>>";
        else if(ctx.wait()) result = `<<wait ${this.visitValue(ctx.wait().value())}>>`;

        for(let i = 0; ctx.commandAppended(i) != null; i++)
            result += this.visitCommand(ctx.commandAppended(i).command());

        return result;

    }

    visitCommandLine(ctx,indent=0){
        const indentString = "\t".repeat(indent);
        if(ctx.command())  return indentString+this.visitCommand(ctx.command());
    }

    visitCompareOperator(ctx){
        if(ctx.EqualOperator()) return "==";
        if(ctx.notEqual()) return "!=";
        if(ctx.GREAT_EQUAL_THAN()) return ">=";
        if(ctx.LOWER_EQUAL_THAN()) return "<=";
        return ctx.getText();
    }

    visitDynamic(ctx){
        return `<<run setup.qsp_dynamic(${this.visitFunctionArguments(ctx.functionArguments())})>>`;
    }

    visitEscapedString(ctx,{inPrintContext=false}={}){
        let result = "";

        var getAtom = (ctx,i)=>ctx.stringAtom(i);
        var getTemplateSuffix = (ctx,i)=>ctx.stringTemplateVarSuffix(i);
        var getTemplateSuffixValue = (ctx,i)=>ctx.stringTemplateVarSuffix(i).stringTemplateVar().value();
        var stringBoundaries = "'";

        if(ctx.doubleQuoteAtom(0) != null || ctx.stringDQTemplateVarSuffix(0) != null){
            getAtom = (ctx,i)=>ctx.doubleQuoteAtom(i);
            getTemplateSuffix = (ctx,i)=>ctx.stringDQTemplateVarSuffix(i);
            getTemplateSuffixValue = (ctx,i)=>ctx.stringDQTemplateVarSuffix(i).stringTemplateVarDQ().value();
            stringBoundaries = '"';
        }else if(ctx.TemplateDoubleSingleQuote(0) != null){
            getAtom = (ctx,i)=>ctx.InEscapedStringAtom(i);
            getTemplateSuffix = (ctx,i)=>null;
            getTemplateSuffixValue = (ctx,i)=>null;
        }

        if(getTemplateSuffix(ctx,0) != null)
            inPrintContext = false;

        var parseAtomText = (text) => {
            if(inPrintContext){
                switch (text) {
                    case "''":
                        return "'";
                    case '""':
                        return '"';
                }
            }else{
                switch (text) {
                    case "'":
                    case "''":
                    case '""':
                        return String.raw`\'`;
                    case '\\':
                        return '\\\\';
                }
            }
            return text;
        }


        for(let i = 0; getAtom(ctx,i) != null; i++){
            const atomText = getAtom(ctx,i).getText();
            result += parseAtomText(atomText);
        }

        for(let i = 0; getTemplateSuffix(ctx,i) != null; i++){
            const visitedValue = this.visitValue(getTemplateSuffixValue(ctx,i));
            if(inPrintContext)
                result += `<<=${visitedValue}>>`;
            else
                result += `${stringBoundaries}+(${visitedValue})+${stringBoundaries}`;
            for(let j = 0; getAtom(getTemplateSuffix(ctx,i),j) != null; j++){
                const atomText = getAtom(getTemplateSuffix(ctx,i),j).getText();
                result += parseAtomText(atomText);
            }
        }

        if(inPrintContext)
            return `''>>${result}<<=''`;

        return `${stringBoundaries}${result}${stringBoundaries}`;
    }

    visitFunctionArguments(ctx){
        var results = [];
        for(let i = 0; ctx.value(i) != null; i++)
            results.push(this.visitValue(ctx.value(i)));
        return results.join(' , ');
    }

    visitFunctionWithNumberReturn(ctx){
        return `setup.qsp_${ctx.WORD().getText().toLowerCase()}(${this.visitFunctionArguments(ctx.functionArguments())})`;
    }

    visitFunctionWithStringReturn(ctx){
        return `setup.qsp_${ctx.WORD().getText().toLowerCase()}(${this.visitFunctionArguments(ctx.functionArguments())})`;
    }



    visitIdentifierNumber(ctx){
        if(ctx.arrayIndex())
            return `QSP.${ctx.WORD()}${this.visitArrayIndex(ctx.arrayIndex())}`;
        return `QSP.${ctx.WORD()}[0]`;
    }

    visitIdentifierString(ctx){
        if(ctx.arrayIndex())
            return `QSP.$${ctx.WORD()}${this.visitArrayIndex(ctx.arrayIndex())}`;
        return `QSP.$${ctx.WORD()}[0]`;
    }

    visitIfBlock(ctx,indent = 0){
        const indentString = "\t".repeat(indent);
        var condition = ctx.value();
        let result = `${indentString}<<if ${this.visitValue(condition)}>>\n`

        result += this.visitBlock(ctx.block(),indent+1);

        for(let i=0; ctx.elseIfBlock(i) != null; i++){
            condition = ctx.elseIfBlock(i).value();
            result += `\n${indentString}<<elseif (${this.visitValue(condition)}) != 0>>\n`;
            result += this.visitBlock(ctx.elseIfBlock(i).block(),indent+1);
        }

        if(ctx.elseBlock()){
            result += `\n${indentString}<<else>>\n`;
            result += this.visitBlock(ctx.elseBlock().block(),indent+1);
        }



        result += `\n${indentString}<</if>>\n`;

        if(ctx.commandAppended())
            result += this.visitCommand(ctx.commandAppended().command());

        return result;

    }

    visitIfInline(ctx){
        if(ctx.ELSE())
            return `<<if ${this.visitValue(ctx.value())}>>${this.visitCommand(ctx.command(0))}<<else>>${this.visitCommand(ctx.command(1))}<</if>>` ;
        return `<<if ${this.visitValue(ctx.value())}>>${this.visitCommand(ctx.command(0))}<</if>>` ;
    }

    visitJump(ctx){
        return `<<JUMP ${this.visitValue(ctx.value())} ${this.jumpCounter++}>>`;
    }

    visitJumpmarker(ctx){
        return `<<JUMPMARKER '${ctx.WORD().getText()}'>>`;
    }

    visitKillvar(ctx){
        if(ctx.value(1)) return `<<run setup.qsp_killvar(${this.visitValue(ctx.value(0))} , ${this.visitValue(ctx.value(1))})>>`;
        if(ctx.value(0)) return `<<run setup.qsp_killvar(${this.visitValue(ctx.value(0))})>>`;
        return "<<run setup.qsp_killvar()>>";
    }

    visitMsg(ctx){
        return `<<run setup.qsp_msg(${this.visitValue(ctx.value())})>>`;
    }

    visitNumberLiteralWithOptionalSign(ctx){
        const numberText = ctx.NumberLiteral().getText();
        const number = Number(numberText); //Catch the edge cases where a number is prefixed with 0
        if(ctx.MINUS())
            return `-${number}`;
        return `${number}`;
    }


    visitNumberOperator(ctx){
        switch (ctx.getText().trim().toUpperCase()) {
            case '+': return '+';
            case '-': return '-';
            case '*': return '*';
            case '/': return '/';
            case 'MOD': return '%';
            case 'AND': return 'AND';
            case 'OR': return 'OR';
        }
    }


    visitPassage(ctx, returnPassageHeader=false) {
        var result = "";

        if(returnPassageHeader)
            result += ctx.PassageIdentifier().getText().trim().toLowerCase().replace('#','::')+"\n";

        result += this.visitBlock(ctx.block());

        function postProcess(code){

            function countOccurrences(t, s) {
                let count = 0;
                let pos = 0;

                while ((pos = t.indexOf(s, pos)) !== -1) {
                    count++;
                    pos += s.length;
                }

                return count;
            }

            function getJumpMarkerId(line){
                const regex = /<<JUMPMARKER '([^']+)'>>/;
                const match = line.match(regex);
                if (match)
                    return match[1];
                return null;
            }

            const codeLines = code.split('\n');
            outerLoop:for (let index = 0; index < codeLines.length; index++) {
                const codeLine = codeLines[index];
                const indentOfJumpMarker = codeLine.indexOf("<<JUMPMARKER");
                if(indentOfJumpMarker == -1) continue;

                //const jumpMarkerName = codeLine.trim().substring("<<JUMPMARKER ".length,codeLine.trim().length-2);
                const jumpMarkerName = getJumpMarkerId(codeLine);
                if(!jumpMarkerName) continue;
                const jumpCommand = `<<JUMP '${jumpMarkerName}'`;



                const c = countOccurrences(code,jumpCommand);

                if(c != 1) continue; //Either an orphan JUMPMARKER or a complex situation with several JUMPs

                for(let searchForJumpLineIndex = index + 1; searchForJumpLineIndex < codeLines.length; searchForJumpLineIndex++){


                    const searchForJumpLineCodeLine = codeLines[searchForJumpLineIndex];
                    const indentOfSeachForJumpLine = searchForJumpLineCodeLine.search(/\S/);

                    if(searchForJumpLineCodeLine.trim() == "")  continue;
                    if(indentOfSeachForJumpLine < indentOfJumpMarker) continue outerLoop;

                    if(searchForJumpLineCodeLine.indexOf(jumpCommand) == -1){
                        continue;
                    }

                    let jumpSuccess = false;
                    const varname = `_qspLoop_${jumpMarkerName}_continue`;

                    const indent = "\t".repeat(indentOfJumpMarker);
                    if(indentOfSeachForJumpLine == indentOfJumpMarker){
                        // We most likely have an inline-if here.
                        const regex = /^(<<if.*?)<<JUMP[^>]*>>(.*?<<\/if>>)$/;
                        const match = searchForJumpLineCodeLine.trim().match(regex);
                        if (match){
                            //It really is an inline-if
                            codeLines[searchForJumpLineIndex] =  `${indent}\t${match[1]}<<set ${varname} = true>>${match[2]}\n${indent}<</for>>`;
                            jumpSuccess = true;
                        }
                    }

                    if(indentOfSeachForJumpLine == indentOfJumpMarker + 1){
                        //Most likely a simple If
                        const regex = /^<<JUMP[^>]*>>$/;
                        const match = searchForJumpLineCodeLine.trim().match(regex);
                        if (match){
                            //It really is an inline-if
                            for(let searchIfIndex = searchForJumpLineIndex + 1; searchIfIndex < codeLines.length; searchIfIndex++){
                                const searchIfLine = codeLines[searchIfIndex];
                                const indentOfSearchIfIndex = searchIfLine.search(/\S/);
                                if(indentOfSearchIfIndex < indentOfJumpMarker){ //We jumped out of the block without findind /if
                                    continue outerLoop;
                                }
                                if(indentOfSearchIfIndex > indentOfJumpMarker) //We are in an inner block
                                    continue;
                                if(searchIfLine.trim() != "<</if>>"){
                                    codeLines[searchIfIndex] += "###";
                                    continue;
                                }

                                codeLines[searchIfIndex] += `\n${indent}<</for>>`;

                                for(let j = searchForJumpLineIndex + 1; j <= searchIfIndex; j++)
                                    codeLines[j] = "\t"+codeLines[j];
                                break;
                            }


                            codeLines[searchForJumpLineIndex] =  `${indent}\t\t<<set ${varname} = true>>`;
                            jumpSuccess = true;
                        }
                    }

                    if(jumpSuccess){
                        codeLines[index] =  `${indent}<<set ${varname} = true>>\n${indent}<<for ${varname}>>\n\t${indent}<<set ${varname} = false>>`;
                        for(let j = index+1; j < searchForJumpLineIndex; j++)
                            codeLines[j] = "\t"+codeLines[j];
                    }

                    //codeLines[searchForJumpLineIndex] = "\t".repeat(indentOfJumpMarker) + "<</for>>";

                    continue outerLoop;

                }
            }
            return codeLines.join("\n");
        }

        try{
            result = postProcess(result);
        }
        catch(e){
            console.error(e);
        }

        return result;
    }

    visitPrint(ctx){
        if(ctx.printMain()){
            if(ctx.printMain().value()) return `<<=${this.visitValue(ctx.printMain().value(),{inPrintContext: true})}>>`;
        }
        if(ctx.printNewlineMain())  return `<<=${this.visitValue(ctx.printNewlineMain().value(),{inPrintContext: true})}>><br/>`;
        if(ctx.printNewlinepreMain())  return `<br/><<=${this.visitValue(ctx.printNewlinepreMain().value(),{inPrintContext: true})}>>`;
        if(ctx.printEmptyLineMain()) return "<br/>";

        if(ctx.printSide())  return `<<run setup.qsp_sidebar(${this.visitValue(ctx.printSide().value(),{inPrintContext: true})})>>`;
        if(ctx.printNewlineSide())  return `<<run setup.qsp_sidebar(${this.visitValue(ctx.printNewlineSide().value(),{inPrintContext: true})})>><<SIDE_BR>>`;
        if(ctx.printNewlinepreSide())  return `<<SIDE_BR>><<run setup.qsp_sidebar(${this.visitValue(ctx.printNewlinepreSide().value(),{inPrintContext: true})})>>`;
        if(ctx.printEmptyLineSide()) return "<<SIDE_BR>>";
    }

    visitStatementLine(ctx,indent = 0){
        if(ctx.actBlock()) return this.visitActBlock(ctx.actBlock(),indent);
        if(ctx.commandLine()) return this.visitCommandLine(ctx.commandLine(),indent);
        if(ctx.ifBlock()) return this.visitIfBlock(ctx.ifBlock(),indent);
    }


    visitSyscall(ctx){
        return `<<${ctx.getText().replace('*','STAR_').toUpperCase()}>>`;
    }

    visitSyssetting(ctx){
        return `<<${ctx.SYSSETTING().getText().toUpperCase()} ${this.visitValue(ctx.value())}>>`;
    }

    visitValue(ctx,{inPrintContext=false}={}){

        if(ctx.ParenthesisLeft()) return `(${this.visitValue(ctx.value(0))})`;
        if(ctx.numberLiteralWithOptionalSign()) return this.visitNumberLiteralWithOptionalSign(ctx.numberLiteralWithOptionalSign());
        if(ctx.identifierNumber()) return this.visitIdentifierNumber(ctx.identifierNumber());
        if(ctx.INPUT()) return `setup.qsp_input(${this.visitValue(ctx.value(0))})`
        if(ctx.invert()) return `setup.logic_not(${this.visitValue(ctx.value(0))})`;
        if(ctx.functionWithNumberReturn()) return this.visitFunctionWithNumberReturn(ctx.functionWithNumberReturn());
        if(ctx.compareOperator()) return `${this.visitValue(ctx.value(0))} ${this.visitCompareOperator(ctx.compareOperator())} ${this.visitValue(ctx.value(1))}`;
        if(ctx.numberOperator()){
            const left = this.visitValue(ctx.value(0));
            const right= this.visitValue(ctx.value(1));
            const op = this.visitNumberOperator(ctx.numberOperator(0));
            if(op == "/")
                return `Math.floor(${left} ${op} ${right})`;
            else if(op == "AND")
                return `${left} && ${right}`;
                //return `(setup.logic_and(${left},${right}))`
            else if(op == "OR")
                return `${left} || ${right}`;
                //return `(setup.logic_or(${left},${right}))`
            else
                return `${left} ${op} ${right}`;
        }

        if(ctx.escapedString()) return this.visitEscapedString(ctx.escapedString(),{inPrintContext: inPrintContext});
        if(ctx.identifierString()) return this.visitIdentifierString(ctx.identifierString());

        if(ctx.functionWithStringReturn()) return this.visitFunctionWithStringReturn(ctx.functionWithStringReturn());
        if(ctx.multilineBlock()) return "`"+ctx.multilineBlock().getText().trim().slice(1,-1).replaceAll(/(\r? \n)|\n/gi,'###NL###').replace(/(\r\n|\n|\r)/gm, "")+"`";
        if(ctx.MINUS()) return `-${this.visitValue(ctx.value(0))}`;
    }
}
