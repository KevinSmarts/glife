#!/usr/bin/env python
# usage: txtmerge.py <input_dir> <output_file_name> 
# does the exact opposite of txtsplit.py

from os import listdir
from os.path import isfile, join
import sys
import re
import io
import time

callList = []
locationCallList = []


def functionEmptyOrNamed(callArray):
    if len(callArray) == 1:
        return None
    else:
        return callArray[1].strip(" \t\n").lower()
    #endif
#enddef

def processLines(lines):
    pattern = "(gt|gs|xgt|xgs)\s*('|\")\w+('|\")(,\s*('|\")\w+('|\"))?"
    locationCalls = {"calllocation": lines[0].strip(' #\n').lower(), "callIds": []}
        
    for line in lines:
        if not line.strip(" \t").startswith("!"): 
            match = re.search(pattern, line)
            if match != None:
                temp = match.group().strip('xgst\t\n').replace('"','').replace("'", "").replace(" ","").split(",")
                loc = temp[0].lower()
                fun = functionEmptyOrNamed(temp)
                call = {"location": loc, "function": fun, "valid": 0}
                if call not in callList:
                    callList.append(call)
                    locationCalls['callIds'].append(len(callList)-1) 
                elif callList.index(call) not in locationCalls['callIds']:
                    locationCalls['callIds'].append(callList.index(call))
                #endif
            #endif
        #endif
    #endfor

    locationCallList.append(locationCalls)
#enddedf 

def validateCalls(lines):
    calls = [c for c in callList if c['location'] == lines[0].strip(' #\n').lower()]

    for call in calls:
        if call['function'] == None or call['function'] == 'start' or call['function'] == '':
            call['valid'] = 1
        else:
            findString = "if$args[0]='%s'" % call['function'].lower()
            findString2 = "if$args[i]='%s'" % call['function'].lower()
            targets = [line.replace(" ", "").lower().strip(' \n\t') for line in lines if findString in line.replace(" ", "").lower() or findString2 in line.replace(" ", "").lower()]
            for t in targets:
                if t.startswith("if$args[") or t.startswith("elseif$args["):
                    call['valid'] = 1
                    break;
                #endif
            #endfor
        #endif
    #endfor
#enddef


assert len(sys.argv) == 2, "usage:\ntest_txtmerge.py <src_input_dir>"

idir = str(sys.argv[1])

print("Start building call list: %s" % time.strftime("%H:%M:%S", time.localtime()))

# grab the location files
filelist = [f for f in listdir(idir) if ".qsrc" in f]
buildlist_start = time.time()
# build a list of all the calls happening
for file in filelist:
    with io.open(join(idir, file), 'rt', encoding='utf-8') as ifile:
        lines = ifile.readlines()
        processLines(lines)

print("Finished building call list: %s" % time.strftime("%H:%M:%S", time.localtime()))

# validating that all the calls are for valid locations
for file in filelist:
    with io.open(join(idir, file), 'rt', encoding='utf-8') as ifile:
        lines = ifile.readlines()
        validateCalls(lines)
#endfor

print("Finished validation %s" % time.strftime("%H:%M:%S", time.localtime()))

# create the call validity file and a list of files that call invalid locations
oname = "call_validity.txt"
try:
    with io.open(oname, 'w', encoding='utf-8') as ofile: 
        ofile.write("----- List of Invalid calls -----\n")
        ofile.write("\n")

        for call in callList:
            if call['valid'] == 0:
                ofile.write("\t\t '%s', '%s' : invalid call\n" % (call['location'], call['function']) )
        #endfor

        ofile.write('\n')

        ofile.write("----- List of Locations and invalid calls they make -----\n")
        ofile.write('\n')
        
        for locationCall in locationCallList:
            headWritten = 0 
            for callId in locationCall["callIds"]:
                call = callList[callId]
                if call["valid"] == 0:
                    if headWritten == 0:
                        ofile.write("\t---- %s:\n" % locationCall["calllocation"])
                        headWritten = 1
                    ofile.write("\t\t '%s', '%s' : invalid call\n" % (call['location'], call['function']) )
            #endfor
            if headWritten != 0:
                ofile.write("\n")
        #endfor
    #endwith

except IOError as e:
    raise SystemExit("ERROR: call validity file was not created! REASON: %s" % e.strerror)
#endtry_except

print("File saved finish: %s" % time.strftime("%H:%M:%S", time.localtime()))