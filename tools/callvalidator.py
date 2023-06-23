#!/usr/bin/env python
# usage:callvalidator.py source=<src_input_dir> [file=<filename> | list=<listfilename>] [folder=<folder>]
# tries to determine whether calls like gt 'location', 'event' are valid or not.

from os import listdir
from os.path import isfile, join
import sys
import re
import io
import time
import xml.etree.ElementTree as ET

idir = ''
callList = []
locationCallList = []
neverCalledLocations = []
callFileList = []
calledFileList = []
validate = 'all'

def loadValidationList(validationListFile):
    result = []
    try:
        tree = ET.parse(validationListFile)
        root = tree.getroot()
        for file in root.iter('File'):
            result.append(join(file.attrib['folder'], file.attrib['name']))
            return result
    except:
        pass
    #endtry

    try: 
        with io.open(validationListFile, 'r', encoding='utf-8') as ifile:
            lines = ifile.readlines()
            index = 1
            for line in lines:
                temp = line.strip(" \r\n\t").split(";")
                file = temp[0].strip(" \t")
                folder = idir
                if ".qsrc" not in file:
                    raise SyntaxError("Incorrect file content: '<filename>[; <folder>] expected, found %s." % (index, line),(validationListFile, index, 1, 'if ".qsrc" not in temp[0].strip(" \t"):', index, len(line)))
                if len(temp) == 2:
                    folder = temp[1].strip(" \t")
                result.append(join(folder,file))
                index += 1
            return result
    except SyntaxError as e:
        raise SystemExit("Invalid list filed: %s" % e.msg)
    #endtry
#enddef


def functionEmptyOrNamed(callArray):
    if len(callArray) < 3:
        return ''
    else:
        return callArray[2].strip(" \t\n")
    #endif
#enddef

def processLines(lines, fileName):
    findPattern = "(gt|gs|xgt|xgs)\s*('|\")\w+('|\")(,\s*('|\")\w+('|\"))?"
    blockEndPattern = "[^}]*}$"
    commentBlock = False
    lineNo = 0
    locationCalls = {"calllocation": lines[0].strip(' #\n'), "fileName": fileName, "calls": []}
    for line in lines:
        line = line.strip(" \t\n")  
        if (not commentBlock) and line.strip("!").startswith("{"):
            commentBlock = True
        if commentBlock and (line == '}' or re.search(blockEndPattern, line) != None):
            commentBlock = False
        if not commentBlock and not line.startswith("!"): 
            match = re.search(findPattern, line)
            if match != None:
                temp = match.group().replace('\t', '').replace(' ', '').replace("','","|").replace('","','|').strip(" '\n").replace("'","|").replace('"','|').split('|')
                temp = [t.strip(" '\"") for t in temp]
                if temp[1].lower() not in ['boystat', 'exp_gain']:
                    calltype = temp[0]
                    loc = temp[1]
                    fun = functionEmptyOrNamed(temp)
                    if ("%s.qsrc" % loc) not in calledFileList:
                        calledFileList.append("%s.qsrc" % loc)
                    calledLocation = {"location": loc, "function": fun, "valid": 0, "reason": "%s.qsrc doesn't exist." % loc}
                    callLine = {"callId": 0, "calltype": calltype, "call": "%s '%s', '%s'" % (calltype, loc, fun), "lineNo": lineNo} 
                    if calledLocation not in callList:
                        callList.append(calledLocation)
                    callLine['callId'] = callList.index(calledLocation)    
                    locationCalls['calls'].append(callLine) 
                #endif
            #endif
        #endif
        lineNo += 1
    #endfor

    locationCallList.append(locationCalls)
#enddedf 

def validateCalls(lines):
    calls = [c for c in callList if c['location'].lower() == lines[0].strip(' #\n').lower()]
    
    if validate == 'all' and (calls == None or len(calls) == 0):
        neverCalledLocations.append(lines[0].strip(' #\n').lower())

    for call in calls:
        if call['function'] == 'start' or call['function'] == 'Start' or call['function'] == '':
            call['valid'] = 1
            call['reason'] = ""
        else:
            call['reason'] = "No $ARGS[0] or ARGS[i] expecting '%s'" % call['function']
            findPattern = "\$*(args|ARGS)\[(0|i)\]\s*=\s*('|\")%s('|\")" % call['function']
            for line in lines:
                match = re.search(findPattern, line)
                if match != None:
                    call['valid'] = 1
                    call['reason'] = ''
                    break
            #endfor
        #endif
    #endfor
#enddef
runtime = [0,1,2,3,4,5,6,7,8,9,10,11,12]
runtime[0] = time.perf_counter_ns()
runtime_text = ["Setup","Build callfile","Build call list","Index call list","Validate calls","Validation finished","Build report [invalid calls]","Sort invalid calls","Build report [location list]","Sort location list","Generate report file","Build report file","Report finished, all done"]

assert (len(sys.argv) == 2 or len(sys.argv) == 3 or len(sys.argv) == 4), "usage:\ncallvalidator.py source=<src_input_dir> [file=<filename> | list=<listfilename>] [folder=<folder>]"

idir = str(sys.argv[1].replace("source=", ""))

if len(sys.argv) == 4:
    vdir = str(sys.argv[3].replace("folder=", ""))
else:
    vdir = idir

validationTarget = ''
runtime[1] = time.perf_counter_ns()
if len(sys.argv) > 2 and "file=" in str(sys.argv[2]):
    validationTarget = sys.argv[2].replace("file=", "")
    callFileList = [join(vdir, sys.argv[2].replace("file=", ""))]
    validate = 'file'
    
if len(sys.argv) > 2 and "list=" in str(sys.argv[2]):
    validationTarget = sys.argv[2].replace("list=", "")
    callFileList = loadValidationList(join(sys.argv[3].replace("folder=", ""), sys.argv[2].replace("list=", "")))
    validate = 'list'

if validate == 'all':
    validationTarget = idir
    callFileList = [join(idir,f) for f in listdir(idir) if ".qsrc" in f]

# build a list of all the calls happening
runtime[2] = time.perf_counter_ns()
for file in callFileList:
    with io.open(file, 'rt', encoding='utf-8') as ifile:
        lines = ifile.readlines()
        processLines(lines, ifile.name)
    #endwith
#endfor
runtime[3] = time.perf_counter_ns()
for call in callList:
        call['callId'] = callList.index(call)

runtime[4] = time.perf_counter_ns()
# validating that all the calls are for valid locations
for file in calledFileList:
    if file not in ['boyStat.qsrc', 'exp_gain.qsrc']:
        try:
            with io.open(join(idir, file), 'rt', encoding='utf-8') as ifile:
                lines = ifile.readlines()
                validateCalls(lines)
        except IOError:
            pass
        #endwith
    #endif
#endfor

runtime[5] = time.perf_counter_ns()
# create the call validity file and a list of files that call invalid locations
timestamp = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
txtname = 'call_validity [%s] - %s.txt' % (validationTarget, time.strftime('%Y%m%d%H%M%S', time.localtime()))
htmlname = 'call_validity [%s] - %s.html' % (validationTarget, time.strftime('%Y%m%d%H%M%S', time.localtime()))

callheads = []
callIds = []
invalidCalls = []
noInvLoc = 0
noNonExistingLoc = 0
noInvFun = 0
noInvCall = 0
noLocNeverCalled = len(neverCalledLocations)

runtime[6] = time.perf_counter_ns()
currLoc = ''
for call in callList:
    if call['valid'] == 0:
        if currLoc != call['location']:
            noInvLoc += 1
            if ".qsrc doesn't exist" in call['reason']:
                noNonExistingLoc += 1
        callIds.append(call['callId'])
        invalidCalls.append(call)
    #enfif
#endfor
runtime[7] = time.perf_counter_ns()
invalidCalls = sorted(invalidCalls, key=lambda k: (k['location'].lower(), k['function'].lower()))
noInvFun = len(invalidCalls)

runtime[8] = time.perf_counter_ns()
for locationCall in locationCallList:
    calls = locationCall['calls']
    Ids = [call['callId'] for call in calls] 

    if any(x in Ids for x in callIds):
        callheads.append(locationCall)
    #endfor
#endfor

runtime[9] = time.perf_counter_ns()
callheads = sorted(callheads, key=lambda k: (k['calllocation'].lower()))
noInvCall = len(callheads)

runtime[10] = time.perf_counter_ns()
location = ''
txtInvalidLines = []
for call in invalidCalls:
    if location != '' and location.lower() != call['location'].lower():
        txtInvalidLines.append('\n')

    txtInvalidLines.append("    '%s', '%s' : %s\n" % (call['location'], call['function'], call['reason']))
    location = call['location']
#endfor

txtLocationLines = []
for head in callheads:            
    txtLocationLines.append("  ---- %s [%s]:\n" % (head["calllocation"], head["fileName"]))
    for call in head['calls']:
        if call['callId'] in callIds:
            target = callList[call['callId']]
            txtLocationLines.append("    invalid call on line %04d: %s '%s', '%s'\t: %s\n" % (call['lineNo'], call['calltype'], target['location'], target['function'], target['reason']))
        #endif
    #endfor
    txtLocationLines.append('\n')
#endfor        

runtime[11] = time.perf_counter_ns()
try:
    with io.open(txtname, 'w', encoding='utf-8') as ofile: 
        ofile.write("----- Summary -----\n")
        ofile.write("  Locations called incorrectly    : %03d\n" % noInvLoc)
        ofile.write("  Non-existing locations called   : %03d\n" % noNonExistingLoc)
        ofile.write("  Number of incorrect calls       : %03d\n" % noInvFun)
        ofile.write("  Locations making incorrect calls: %03d\n" % noInvCall)
        if validate == 'all':
            ofile.write("  Locations never called          : %03d\n" % noLocNeverCalled)
        ofile.write("\n")
        if validate == 'list':
            ofile.write("----- Validated files -----\n")
            if len(callFileList) > 10:
                ofile.write("  The list contains %d files. Please see the list in %s.\n" % (len(callFileList), validationTarget))
            else:                
                for file in callFileList:
                    ofile.write("  %s\n" % file)
            #endif
            ofile.write('\n')
        #endif

        ofile.write("----- List of Invalid calls -----\n")
        ofile.write("\n")
        
        for line in txtInvalidLines:
            ofile.write(line)

        ofile.write('\n')

        ofile.write("----- List of Locations and invalid calls they make -----\n")
        ofile.write('\n')
        
        for line in txtLocationLines:
            ofile.write(line)

        if validate == 'all':
            ofile.write("----- List of Locations that are never called -----\n")

            for line in neverCalledLocations:
                ofile.write("%s\n" % line)                    

    #endwith
except IOError as e:
    raise SystemExit("ERROR: call validity file was not created! REASON: %s" % e.strerror)
#endtry_except

runtime[12] = time.perf_counter_ns()

max = len(runtime)
index = 0
while index < max:
    print("%s: %s" % (runtime_text[index], runtime[index]))
    index += 1

