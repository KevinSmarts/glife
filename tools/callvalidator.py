#!/usr/bin/env python
# usage: txtmerge.py <input_dir> <output_file_name> 
# does the exact opposite of txtsplit.py

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
#        except Exception as e:
#            raise SystemExit()
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


assert (len(sys.argv) == 2 or len(sys.argv) == 3 or len(sys.argv) == 4), "usage:\ncallvalidator.py source=<src_input_dir> [file=<filename> | list=<listfilename>] [folder=<folder>]"

idir = str(sys.argv[1].replace("source=", ""))

if len(sys.argv) == 4:
    vdir = str(sys.argv[3].replace("folder=", ""))
else:
    vdir = idir

validationTarget = ''

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

print("Start building call list: %s" % time.strftime("%H:%M:%S", time.localtime()))

# grab the location files


buildlist_start = time.time()
# build a list of all the calls happening
for file in callFileList:
    with io.open(file, 'rt', encoding='utf-8') as ifile:
        lines = ifile.readlines()
        processLines(lines, ifile.name)
    #endwith
#endfor

for call in callList:
        call['callId'] = callList.index(call)

print("Finished building call list: %s" % time.strftime("%H:%M:%S", time.localtime()))

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

print("Finished validation %s" % time.strftime("%H:%M:%S", time.localtime()))

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
invalidCalls = sorted(invalidCalls, key=lambda k: (k['location'].lower(), k['function'].lower()))
noInvFun = len(invalidCalls)

for locationCall in locationCallList:
    calls = locationCall['calls']
    Ids = [call['callId'] for call in calls] 

    if any(x in Ids for x in callIds):
        callheads.append(locationCall)
    #endfor
#endfor
callheads = sorted(callheads, key=lambda k: (k['calllocation'].lower()))
noInvCall = len(callheads)

location = ''
txtInvalidLines = []
#htmlInvalidLines = []
for call in invalidCalls:
    if location != '' and location.lower() != call['location'].lower():
        txtInvalidLines.append('\n')
#    if location == '' or location.lower() != call['location'].lower():
#        htmlInvalidLines.append('\t\t\t<tr><td span="3"><h3>%s</td></tr>\n' % call['location'])

    txtInvalidLines.append("    '%s', '%s' : %s\n" % (call['location'], call['function'], call['reason']))
#    htmlInvalidLines.append('\t\t\t<tr><td style="border: 1px solid black; padding: 5px;">\'%s\'</td><td style="border: 1px solid black; padding: 5px;">%s</td></tr>\n' % (call['function'], call['reason']))
    location = call['location']
#endfor

txtLocationLines = []
#htmlLocationLines = []
for head in callheads:            
    txtLocationLines.append("  ---- %s [%s]:\n" % (head["calllocation"], head["fileName"]))

#    htmlLocationLines.append("\t\t<h3>%s</h3>\n" % head["calllocation"])
#    htmlLocationLines.append('\t<table style="border: 2px solid black;>\n')
#    htmlLocationLines.append('\t\t<thead>\n')
##    htmlLocationLines.append('\t\t\t<tr><td style="border: 1px solid black; padding: 5px;">Line</td><td style="border: 1px solid black; padding: 5px;">Call</td><td style="border: 1px solid black; padding: 5px;">Reason</td></tr>')
#    htmlLocationLines.append('\t\t</thead>\n')
#    htmlLocationLines.append('\t\t<tbody>\n')

    for call in head['calls']:
        if call['callId'] in callIds:
            target = callList[call['callId']]
            txtLocationLines.append("    invalid call on line %04d: %s '%s', '%s'\t: %s\n" % (call['lineNo'], call['calltype'], target['location'], target['function'], target['reason']))
 #           htmlLocationLines.append('\t\t\t<tr><td style="border: 1px solid black; padding: 5px;">%d</td><td style="border: 1px solid black; padding: 5px;">%s \'%s\', \'%s\'</td><td style="border: 1px solid black; padding: 5px;">%s</td></tr>\n' % (call['lineNo'], call['calltype'], target['location'], target['function'], target['reason']) )    
        #endif
    #endfor
    txtLocationLines.append('\n')

#    htmlLocationLines.append('\t\t</tbody>\n')
#    htmlLocationLines.append('\t</table>\n')
#    htmlLocationLines.append('<br/>')
#endfor        

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

print("File saved finish: %s" % time.strftime("%H:%M:%S", time.localtime()))

#### Create HTML

"""     with io.open(htmlname, 'w', encoding='utf-8') as hfile:         
        hfile.write('<!DOCTYPE html>\n')
        hfile.write('<html lang="en">\n')
        hfile.write('\t<head>\n')
        hfile.write('\t\t<title>Invalid Call Report</title>\n')
        hfile.write('\t</head>\n')
        
        hfile.write('\t<body>\n')
       
        hfile.write("\t\t<h2>List of Invalid calls</h2>\n")
        hfile.write('<br/>\n')
        
        hfile.write('\t<table style="border: 2px solid black;>\n')
        hfile.write('\t\t<thead>\n')
        hfile.write('\t\t\t<tr><td style="border: 1px solid black; padding: 5px;">Function</td><td style="border: 1px solid black; padding: 5px;">Reason</td></tr>')
        hfile.write('\t\t</thead>\n')
        hfile.write('\t\t<tbody>\n')

        for line in htmlInvalidLines: 
            hfile.write(line)
        
        hfile.write('\t\t</tbody>\n')
        hfile.write('\t\t</table>\n')
        hfile.write('<br/>\n')

        hfile.write("<h2>List of Locations and invalid calls they make</h2>\n")
        hfile.write('<br/>\n')
        
        for line in htmlLocationLines:
            hfile.write(line)

        hfile.write('\t</body>\n')
        hfile.write('</html>\n') """
    
    #endwith
    

