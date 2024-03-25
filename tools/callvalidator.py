#!/usr/bin/env python
# usage:callvalidator.py source=<src_input_dir> [file=<filename> | list=<listfilename>] [folder=<folder>]
# tries to determine whether calls like gt 'location', 'event' are valid or not.

from os import listdir
from os.path import join
import sys
import re
from io import open
from time import perf_counter_ns
import xml.etree.ElementTree as ET
from textwrap import wrap
from typing import List
from threading import Thread
from difflib import SequenceMatcher


def createcallFileList(callFileList: List) -> None:
    validationTarget = ''
    if len(sys.argv) > 2 and "file=" in str(sys.argv[2]):
        validationTarget = sys.argv[2].replace("file=", "")
        callFileList = [join(vdir, sys.argv[2].replace("file=", ""))]
        validate = 'file'
        
    if len(sys.argv) > 2 and "list=" in str(sys.argv[2]):
        validationTarget = sys.argv[2].replace("list=", "")
        validationListFile = join(sys.argv[3].replace("folder=", ""), sys.argv[2].replace("list=", ""))
        try:
            tree = ET.parse(validationListFile)
            root = tree.getroot()
            for file in root.iter('Location'):
                callFileList.append(join(file.attrib['folder'] if "folder" in file.attrib.keys() else idir, "%s.qsrc" % file.attrib['name'].replace('$', '_')))
        except:
            try: 
                with open(validationListFile, 'r', encoding='utf-8') as ifile:
                    lines = ifile.readlines()
                    for index, line in enumerate(lines):
                        temp = line.strip(" \r\n\t").split(";")
                        file = temp[0].strip(" \t")
                        if ".qsrc" not in file:
                            raise SyntaxError()
                            raise SyntaxError("Incorrect file content: '<filename>[; <folder>] expected, found %s." % line,(validationListFile, index, 1, 'if ".qsrc" not in temp[0].strip(" \t"):', index, len(line)))
                        if len(temp) == 2:
                            callFileList.append(join(temp[1].strip(" \t"),file))
                        else:
                            callFileList.append(join(idir,file))
                    #endfor
                #endwith
            except SyntaxError as e:
                raise SystemExit("Invalid list filed: %s" % e.msg)
            #endtry   
        #endtry  
        validate = 'list'
    #endif <- "list="

    if validate == 'all':
        validationTarget = idir
        callFileList = [join(idir,f) for f in listdir(idir) if ".qsrc" in f]
    #endif
#enddef createValidationList()

def buildValidCallsList(locationFileList) -> None:
    # Build the list of valid calls
    linecount = []
    for file in locationFileList:
        with open(join(idir, file), 'rt', encoding='utf-8', newline="\n") as ifile:
            lines = ifile.readlines()
            linecount.append({"file": file, "lc": len(lines)})
            location = lines[0].strip(' #\r\n').strip(' ')
            if location not in locationList: 
                locationList.append(location)
                lcLocationList.append(location.lower())
            blockComment = False

            for line in lines:
                #getting locations
                workline = line.strip(' \t\r\n')
                locationsInLine = []
                isCommentedLine = blockComment
                
                match = re.search(calledLinePattern, workline)
                if match != None:
                    potLine = re.findall(findLocationValues, workline)
                    if not blockComment and re.search(blockCommentStart, workline) != None: 
                        blockComment = True
                        isCommentedLine = True
                    if not blockComment and re.search(commentLine, workline) != None: isCommentedLine = True
                    if potLine != None: locationsInLine = potLine
                    if blockComment and re.search(blockCommentEnd, workline) != None: blockComment = False                    
                #endif

                for match in locationsInLine: 
                    record = {"location": location.lower(), "function": match, "isCommentLine": isCommentedLine}
                    recordInv = {"location": location.lower(), "function": match, "isCommentLine": not isCommentedLine}
                    if record not in validLocationCalls and recordInv not in validLocationCalls: 
                        validLocationCalls.append({"location": location, 
                                                "function": match, 
                                                "isCommentLine": isCommentedLine})
                        lcValidLocationCalls.append({"location": location.lower(), "function": match.lower()})
                    elif recordInv in validLocationCalls:
                        # if commentLine of recordInv is TRUE then set it to false.
                        # if commentLine of recordInv is FALSE then leave it alone
                        if recordInv["isCommentLine"]:
                            index = validLocationCalls.index(recordInv)
                            validLocationCalls[index]['isCommentLine'] = False
                    #endif
                #endfor <- match in locationsInLine
            #endfor <- lineNo, line
        #endwith
    #endfor
#enddef buildValidCallsList()

def validCallsByLocationTXT(validLocationCalls: List) -> None:
    with open('valid-calls-by-location.txt', 'w', encoding='utf-8') as ofile:
        currLoc = ''
        ofile.write("---- List of valid calls by location\n")
        for call in validLocationCalls:
            if call['location'] != currLoc:
                ofile.write("\n")
                ofile.write("  ---- %s -------------\n" % call['location'])
                currLoc = call['location']
            ofile.write("    '%s': Commented Line: %s\n" % (call['function'], call['isCommentLine']))
#enddef validCallsByLocationTXT

def validCallsByLocationMD(validLocationCalls: List) -> None:
    with open('valid-calls-by-location.md', 'w', encoding='utf-8') as ofile:
        ofile.write("## Valid Calls per Location")
        currLoc = ''
        for call in validLocationCalls:
            if call['location'] != currLoc:
                currLoc = call['location']
                ofile.write("\n")
                ofile.write("### %s" % currLoc)
                ofile.write("\n")
                ofile.write('| "Function" | Is Comment |\n')
                ofile.write("| ---------- | ---------- |\n")
            ofile.write("| `'%s'` | %s |\n" % (call['function'], call['isCommentLine']))
        ofile.write("\n")
#enddef validCallsByLocationMD
def validCallsForTest(validLocationCalls) -> None:
    with open('validcallsfortesting.txt', 'w', encoding='utf-8') as ofile:
        for call in validLocationCalls:
            if not call['isCommentLine']: ofile.write("%s:%s\n" % (call['location'], call['function'])) 
#enddef validCallsForTest

def invalidCallsMissingLocationsTXT(invalidLocations: List, callsWithTypos: List, missingLocations: List) -> None:
    with open('invalid-calls-missing-locations.txt', 'w', encoding='utf-8') as ofile:
        
        ofile.write("----- Summary ------------------------------------------\n")
        ofile.write("  Locations called incorrectly         : {:>4}\n".format(len(invalidLocations)))
        ofile.write("    Location/File doesn't exist        : {:>4} [{:>3.2f}%%]\n".format(invalidLocationMissing,(invalidLocationMissing/len(invalidLocations))*100))
        ofile.write("    Commented out code                 : {:>4} [{:>3.2f}%%]\n".format(invalidCommentLine, (invalidCommentLine/len(invalidLocations))*100))
        ofile.write("    Value not expected/handled         : {:>4} [{:>3.2f}%%]\n".format(invalidFunctionMissing, (invalidFunctionMissing/len(invalidLocations))*100))
        ofile.write("--------------------------------------------------------\n")
        ofile.write("  Locations making incorrect calls     : {:>4}\n".format(locationsMakingInvalidCalls))
        ofile.write("  Total number of invalid calls        : {:>4}\n".format(len(invalidCallsMade)))
        ofile.write("    Calls made to non-existing location: {:>4} [{:>3.2f}%%]\n".format(invalidCallsToMissingLocation, (invalidCallsToMissingLocation/len(invalidCallsMade))*100))
        ofile.write("    Location or File name has typo     : {:>4} [{:>3.2f}%%]\n".format(invalidCallsToDueToTypos,(invalidCallsToDueToTypos/len(invalidLocations))*100))
        ofile.write("    Calls made to commented location   : {:>4} [{:>3.2f}%%]\n".format(invalidCallsToCommentedCode, (invalidCallsToCommentedCode/len(invalidCallsMade))*100))
        ofile.write("    Calls made with unexpected value   : {:>4} [{:>3.2f}%%]\n".format(invalidCallsToMissingFunction, (invalidCallsToMissingFunction/len(invalidCallsMade))*100))
        ofile.write("\n")
        ofile.write("    Valid calls with typos             : {:>4} [{:>3.2f}%%]\n".format(validCallsWithTypos, (validCallsWithTypos/(len(locationCallList)-len(invalidCallsMade)))*100))
        ofile.write("--------------------------------------------------------\n")
        ofile.write("  Missing locations called             : {:>4}\n".format(len(missingLocations)))
        ofile.write("--------------------------------------------------------\n")
        ofile.write("\n")
        ofile.write("\n")
        ofile.write("{:^80}\n".format("---------- List of Invalid Calls by location ----------"))
        currLoc = ''
        for call in invalidLocations:
            if call['location'] != currLoc:
                ofile.write("\n")
                ofile.write("  ---- %s -------------\n" % call['location'])
                currLoc = call['location']
            wrapis = wrap("  {:<34}: {}\n".format("'%s'" % call['function'], call['reason']), 125, subsequent_indent="{:<31}".format(' '), break_long_words=True)
            for line in wrapis:           
                ofile.write("%s\n" % line)
        #endfor <- call in invalidLocations

        ofile.write("\n")
        ofile.write("{:^125}\n".format("---------- Invalid Calls made by location ----------"))
        currLoc = ''
        for call in invalidCallsMade:
            if call['callinglocation'] != currLoc:
                ofile.write("\n")
                ofile.write("  ---- %s [%s]-------------\n" % (call['callinglocation'], call['file']))
                currLoc = call['callinglocation']
            ofile.write("Line {:>4}: {} '{}', '{}'\n".format(call['lineNo'], call['calltype'], call['location'], call['function']))
            for line in wrap("%s%s" % (call['reason'].replace("`", "'"), " %s" % call['typo_msg'] if call['func_typo'] else ''), 120, initial_indent='    ', subsequent_indent='    ', break_long_words=True):
                ofile.write("%s\n"%line)
        #endfor <- call in invalidCallsMade

        ofile.write("\n")
        ofile.write("{:^125}\n".format("---------- Calls with typos made by location ----------"))
        currLoc = ''
        for call in callsWithTypos:
            if call['callinglocation'] != currLoc:
                ofile.write("\n")
                ofile.write("  ---- %s [%s]-------------\n" % (call['callinglocation'], call['file']))
                currLoc = call['callinglocation']
            ofile.write("Line {:>4}: {}\n".format(call['lineNo'], call['typo_msg']))
        #endfor <- call in callsWithTypos

        ofile.write("\n")
        ofile.write("{:^80}\n".format("---------- List of Missing Locations ----------"))
        
        ofile.write("\n")
        for location in missingLocations:
            ofile.write("  {:<25} [{}] \n".format(location, join(idir, "%s.qsrc" % location)))
    #endwith
#enddef invalidCallsMissingLocationsTXT

def invalidCallsMissingLocationsMD(invalidLocations: List, callsWithTypos: List, missingLocations: List) -> None:
    with open('invalid-calls-missing-locations.md', 'w', encoding='utf-8') as ofile:
        ofile.write("## List of Invalid Calls\n")    
        currLoc = ''
        for call in invalidLocations:            
            if call['location'] != currLoc:
                currLoc = call['location']
                ofile.write("\n")
                ofile.write("### %s" % currLoc)
                ofile.write("\n")
                ofile.write('| "Function" | Is Comment |\n')
                ofile.write("| ---------- | ---------- |\n")
            ofile.write("| `%s` | %s |\n" % (call['function'], call['reason']))
        ofile.write("\n")
        ofile.write("---\n")
        ofile.write("\n")
        ofile.write("## Calls made by locations\n")
        currLoc = ''
        for call in invalidCallsMade:
            if call['callinglocation'] != currLoc:
                currLoc = call['callinglocation']
                ofile.write("\n")
                ofile.write("### %s\n" % call['callinglocation'])
                ofile.write("\n")
                ofile.write("| File | Line No. | Call | Reason |\n")
                ofile.write("| ---- | -------- | ---- | ------ |\n")
            ofile.write("| {} | {:>4} | `{} '{}', '{}'` | {} |\n".format(call['file'], call['lineNo'], call['calltype'], call['location'], call['function'], call['reason']))
        ofile.write("\n")
        ofile.write("---\n")
        ofile.write("\n")
        ofile.write("## List of Missing Locations\n")
        ofile.write("\n")
        ofile.write ("| Location | File |\n")
        ofile.write ("| -------- | ---- |\n")
        for location in missingLocations:
            ofile.write("| %s | %s |\n" % (location, join(idir, "%s.qsrc" % location)))
    #endwith
#enddef invalidCallsMissingLocationsMD


runtime = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
runtime[0] = perf_counter_ns()

idir = ''
validLocationCalls = []
lcValidLocationCalls = []
locationList = []
lcLocationList = []
locationFileList = []
missingLocations = []
locationCallList = []
callFileList = []
calledLocationList = []
validate = 'all'
locationsToIgnore = ['boystat', 'exp_gain']
fileToIgnore = ["%s.qsrc" % loc for loc in locationsToIgnore]
fileToIgnore += ['booty_call_after.qsrc','booty_call_condoms.qsrc','booty_call_cowgirl.qsrc','booty_call_cum.qsrc','booty_call_doggy.qsrc','booty_call_favorite_part.qsrc','booty_call_leave.qsrc','booty_call_miss.qsrc','booty_call_morning.qsrc','booty_call_pillow_talk.qsrc','booty_call_pillow_talk2.qsrc','booty_call_reactions.qsrc','booty_call_sex.qsrc','booty_call_shower.qsrc','booty_call_sms.qsrc','booty_call_start.qsrc','booty_call_stats.qsrc','booty_call_talk.qsrc','booty_call_virgin.qsrc','booty_call_work_talk1.qsrc']
commentLine = "^(\s*!+)"
blockCommentStart = "(^\s*!+.*{)"
blockCommentEnd = "(}[^{]*$)"
blockComment = False
callLinePattern = "(gt|gs|xgt|xgs)(?:\s*(?:'|\"))(\w+)(?:'|\")(?:(?:,\s*)(?:'|\")(\w+)(?:'|\"))?"
findCallLine = "(?:^\s*!+.*{)|(?:^[^!]*)(gt|gs|xgt|xgs)\s*(?:'|\")(\w+)(?:'|\")(?:(?:,\s*)(?:'|\")(\w+)(?:'|\"))?|(?:}[^{]*$)"
calledLinePattern = "(?:^\s*!+.*{)|(?:(?:if|elseif)?\s*\(?\$?(?:ARGS|args)\[(?:0|i)\])(?:\s*(?:=|!|<|>|>=|=>|<=|=<)\s*(?:'|\"))(\w+)(?:'|\")|(?:}[^{]*$)"
findLocationValues = "(?:(?:if|elseif)?\s*\(?\$?(?:ARGS|args)\[(?:0|i)\])(?:\s*(?:=|!|<|>|>=|=>|<=|=<)\s*(?:'|\"))(\w+)(?:'|\")"
runtime_text = ['Initialising "global" variables',                      #0
                "Initialise with Arguments",                            #1
                "Build call file list and valid calls list (%d files)", #2
                "Building call list [%d files]",                        #3
                "Sorting and ordering the lists for the files",         #4
                "Creating error type list [invalidLocations]",          #5
                "Creating error type list [callsWithTypos]",            #6
                "Generating file output",                               #7
                "All is finished",                                      #8
                "",                                                     #9
                "",                                                     #10
                "",                                                     #11
                "",                                                     #12
                ""]                                                     #13


runtime[1] =  perf_counter_ns()
print("0. %s: %d : %d: %d" % (runtime_text[0], runtime[0], runtime[1], runtime[1]-runtime[0] ))
assert (len(sys.argv) == 2 or len(sys.argv) == 3 or len(sys.argv) == 4), "usage:\ncallvalidator.py source=<src_input_dir> [file=<filename> | list=<listfilename>] [folder=<folder>]"

idir = str(sys.argv[1].replace("source=", ""))

if len(sys.argv) == 4:
    vdir = str(sys.argv[3].replace("folder=", ""))
else:
    vdir = idir

locationFileList = [f for f in listdir(idir) if ".qsrc" in f and f not in fileToIgnore]

callFileListThread = Thread(target=createcallFileList(callFileList), args=(callFileList,))
validCallsListThread = Thread(buildValidCallsList(locationFileList), args=(locationFileList))

runtime[2] = perf_counter_ns()
print("1. %s: %d : %d: %d" % (runtime_text[1], runtime[1], runtime[2], runtime[2]-runtime[1] ))

callFileListThread.start()
validCallsListThread.start()

callFileListThread.join()
validCallsListThread.join()
runtime[3] = perf_counter_ns()
print("2. %s: %d : %d: %d" % (runtime_text[2] % len(locationFileList), runtime[2], runtime[3], runtime[3]-runtime[2] ))

# build a list of all the calls happening
for file in callFileList:
    with open(file, 'rt', encoding='utf-8', newline="\n") as ifile:
        lines = ifile.readlines()

        location = lines[0].strip(' #\r\n').strip(' ')
        for lineNo, line in enumerate(lines):
            workline = line.strip(' \t\n\r')
            match = None
            msg = ''
            temp_match = re.search(findCallLine, workline)
            if temp_match != None and not [res for res in locationsToIgnore if res in workline.lower()]:
                potLine = re.search(callLinePattern, workline)
                if not blockComment and re.search(blockCommentStart, line) != None: blockComment = True
                if not blockComment and potLine != None: match = potLine
                if blockComment and re.search(blockCommentEnd, line) != None: blockComment = False                    
            #endif
            
            if match != None:
                valid = 0
                func_typo = 0
                loc_typo = 0
                typo_msg = ""
                loc_msg = ""
                func_msg = "."
                reason = ""            
                loc = match.group(2)   
                func = '' if match.group(3) == None else match.group(3) 
                searchRecord = {"location": loc.lower(), "function": func.lower()}
                if searchRecord['location'] not in lcLocationList:
                    valid = -1
                    reason = "Location `%s` doesn't exist - No file containing this location was found in the specified folder." % (loc)
                    if loc not in missingLocations: missingLocations.append(loc)
                else:
                    if loc not in locationList:
                        index = lcLocationList.index(searchRecord['location'])
                        loc_typo = 1
                        loc_msg = "The location name is '%s' not '%s'" % (locationList[index], loc) 
                    #endif
                    if searchRecord['function'] == '' and searchRecord not in lcValidLocationCalls:
                        validLocationCalls.append({"location": loc, "function": '', "isCommentLine": False })
                        lcValidLocationCalls.append(searchRecord)
                    elif searchRecord in lcValidLocationCalls:
                        index = lcValidLocationCalls.index(searchRecord)
                        validL = validLocationCalls[index]
                        if validL['function'] == func:
                            if not validL['isCommentLine']:
                                valid = 1
                                reason = ""
                            else:
                                valid = -2
                                reason = "`%s, %s` exists but is either commented out or is in a comment block" % (loc, func)                    
                            #endif
                        else:
                            valid = -3
                            reason = "Location `%s` exists but couldn't find any entrypoint expecting `%s` as $ARGS[0]. Please confirm whether this is a bug or not." % (loc, func)
                            func_typo = 1
                            if validL['isCommentLine']: 
                                if loc_typo:
                                    func_msg = " and $AGRS[0] has a case typo, it is '%s' not '%s'. Also, the correct call is a comment line or in a comment block." % (validL['function'], func)
                                else:
                                    func_msg = "$AGRS[0] has a case typo, it should be '%s' not '%s'. Also, the correct call is a comment line or in a comment block." % (validL['function'], func)
                            else:
                                if loc_typo:
                                    func_msg = " and $AGRS[0] has a case typo, it is '%s' not '%s'." % (validL['function'], func)
                                else:
                                    func_msg = "$AGRS[0] has a case typo, it should be '%s' not '%s'." % (validL['function'], func)
                            #endif
                        #endif
                    else:              
                        strictness = 0.75       
                        possible_funcs = []
                        for f in (f['function'] for f in validLocationCalls if f['location'] == loc.lower() and 
                                  f['function'] not in possible_funcs and 
                                  f['function'] != func and 
                                  ("%s_" % func) not in f['function'] and 
                                  ("%s_" % f['function']) not in func):
                            similarity = SequenceMatcher(None, func, f, strictness)
                            if similarity.ratio() >= strictness:
                                possible_funcs.append("'%s'" % f)

                        valid = -3
                        reason = "Location `%s` exists but couldn't find any entrypoint expecting `%s` as $ARGS[0]. Please confirm whether this is a bug or not." % (loc, func)
                        if len(possible_funcs) > 0:
                            reason += "\nThere may be a typo in the $ARGS[0] value passed. Some similar expected $ARGS[0] values are: %s" % ", ".join(possible_funcs)
                    #endif
                #endif    
                if loc_typo or func_typo: typo_msg = "The call has %s. %s%s [%s]" % ("a typo" if func_typo != loc_typo else "typos", loc_msg, func_msg, "The call will fail" if func_typo else "The call will work")

                locationCallList.append({"callinglocation": location, 
                                        "file": ifile.name, 
                                        "lineNo": lineNo+1, 
                                        "calltype": match.group(1), 
                                        "location": loc, 
                                        "function": func, 
                                        "valid": valid, 
                                        "reason": reason,
                                        "loc_typo": loc_typo,
                                        "func_typo": func_typo,
                                        "typo_msg": typo_msg})   
                i = 0 
            #endif# <- Match != None
        #endfor <- line in lines
    #endwith
#endfor

runtime[4] = perf_counter_ns()
print("3. %s: %d : %d: %d" % (runtime_text[3] % len(callFileList), runtime[3],runtime[4], runtime[4]-runtime[3] ))

missingLocations = sorted(missingLocations)
validLocationCalls = sorted(validLocationCalls, key=lambda k: (k['location'].lower(), k['function']))
invalidCallsMade = [call for call in locationCallList if call['valid'] < 0]
invalidCallsMade = sorted(invalidCallsMade, key = lambda k: (k['callinglocation'].lower(), k['lineNo']))
invalidLocations = []
callsWithTypos = []
invalidCallsToMissingLocation = 0
invalidCallsToCommentedCode = 0
invalidCallsToMissingFunction = 0
invalidCallsToDueToTypos = 0
invalidLocationMissing = 0
invalidCommentLine = 0
invalidFunctionMissing = 0
locationsMakingInvalidCalls = 0
validCallsWithTypos = 0

runtime[5] = perf_counter_ns()
print("4. %s: %d : %d: %d" % (runtime_text[4], runtime[4], runtime[5], runtime[5]-runtime[4] ))

currLoc = ''
for call in invalidCallsMade:
    record = {"location": call['location'], "function": call['function'], "valid": call['valid'], "reason": call['reason'], "func_type": call['func_typo'], "loc_typo": call['loc_typo'], "typo_msg": call['typo_msg']}
    if call['callinglocation'] != '':
        locationsMakingInvalidCalls += 1
        currLoc = call['callinglocation']
    if call['valid'] == -1: invalidCallsToMissingLocation += 1
    if call['valid'] == -2: invalidCallsToCommentedCode += 1
    if call['valid'] == -3: invalidCallsToMissingFunction += 1
    if call['func_typo']  : invalidCallsToDueToTypos += 1

    if record not in invalidLocations: 
        invalidLocations.append(record)
        if record['valid'] == -1: invalidLocationMissing += 1
        if record['valid'] == -2: invalidCommentLine += 1
        if record['valid'] == -3: invalidFunctionMissing += 1
invalidLocations = sorted(invalidLocations, key=lambda k: (k['location'].lower(), k['function'])) 

runtime[6] = perf_counter_ns()
print("5. %s: %d : %d: %d" % (runtime_text[5], runtime[5], runtime[6], runtime[6]-runtime[5] ))

##endfor for call in locationCallList
callsWithTypos = [call for call in locationCallList if call['loc_typo'] or call['func_typo']]
validCallsWithTypos = len(callsWithTypos)
callsWithTypos = sorted(callsWithTypos, key=lambda k: (k['callinglocation'].lower(), k['lineNo'])) 

runtime[7] = perf_counter_ns()
print("6. %s: %d : %d: %d" % (runtime_text[6], runtime[6], runtime[7], runtime[7]-runtime[6] ))

fileThread1 = Thread(target=validCallsByLocationTXT(validLocationCalls), args=(validLocationCalls,))
#fileThread2 = Thread(target=validCallsByLocationMD(validLocationCalls), args=(validLocationCalls,))
fileThread3 = Thread(target=validCallsForTest(validLocationCalls), args=(validLocationCalls,))
fileThread4 = Thread(target=invalidCallsMissingLocationsTXT(invalidLocations, callsWithTypos, missingLocations), args=(invalidLocations, callsWithTypos, missingLocations))
#fileThread5 = Thread(target=invalidCallsMissingLocationsMD(invalidLocations, callsWithTypos, missingLocations), args=(invalidLocations, callsWithTypos, missingLocations))

fileThread1.start()
#fileThread2.start()
fileThread3.start()
fileThread4.start()
#fileThread5.start()

fileThread1.join()
#fileThread2.join()
fileThread3.join()
fileThread4.join()
#fileThread5.join()

runtime[8] = perf_counter_ns()
print("7. %s: %d : %d: %d" % (runtime_text[7], runtime[7], runtime[8], runtime[8]-runtime[7] ))
print("8. %s: %d : %d: %d" % (runtime_text[8], runtime[0], runtime[8], runtime[8]-runtime[0] ))