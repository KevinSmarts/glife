#!/usr/bin/env python
# usage: test_txtmerge.py <-help>|<-h>|<?> or ntest_txtmerge.py <src_input_dir> <testsuite file>
# builds a test version of the QSP game

import os
import sys
import re
import io 
import xml.etree.ElementTree as ET
from datetime import datetime
from os.path import join, isfile

assert len(sys.argv) in [3,4], "usage:\ntest_txtmerge.py <-help>|<-h>|<?> or ntest_txtmerge.py <src_input_dir> <testsuite file> <save_enabled>"

if str(sys.argv[1]) in ['-help', '-h', '?']:
    print("testbuilder.py requires two parameters to run properly:")
    print("\t<src_input_dir>: the folder where the files of the tested application are relative to the root folder, e.g. 'location'")
    print("\t<testsuite file>: the testsuite config file inlcuding the folder where it can be found relative to the root folder, e.g. 'test\test-suite.qproj'")
    print("Other parameters that can be used:")
    print("\t-help|-h|? : prints this help text")
    print("")
    exit
else:
    idir = str(sys.argv[1])
suitefile = str(sys.argv[2])
save_enabled = str(sys.argv[3]).lower() == 'true'.lower()

# read the project xml file first
# let's do this later in order to implement directory structure
tree = ET.parse(suitefile)
root = tree.getroot()

project = root.attrib['project']
testsuite = root.attrib["name"]
testdir = root.attrib["folder"]

################################################################################################
#
# Validate that the 'location', 'function' called in the tests actually exist in the code.
#
#####

# Iterate through the test locations and create a list of `$LOCATIONNAME`, `$FUNCTIONNAME` pairs called
testCalls = []
test_locations = []
test_run_list = []
tested_locations = []
valid_locations = []
dependency_locations = []


for location in root.iter('TestLocation'):
    tname = location.attrib['name']
    tname = tname.replace("$","_")
    try:
        testdir = location.attrib['folder']
    except:
        pass

    locationPattern = "(?:\$LOCATIONNAME\s*=\s*(?:'|\"))(\w*)(?:'|\")"
    functionPattern = "(?:\$FUNCTIONNAME = (?:'|\"))(\w*)(?:'|\")"
    testFunctionPattern = "(?:@run\s*(?:'|\")?)(\w+)(?:'|\")?"
    try:        
        with io.open(join(testdir,tname + '.qsrc'), 'rt', encoding='utf-8') as ifile:
            text = ifile.read() 

        location = re.findall(locationPattern, text)[0]
        
        for testFunction in re.findall(testFunctionPattern, text):
            start_calls = "gs '%s', '%s'" % (tname, testFunction)
            if start_calls not in test_run_list: test_run_list.append(start_calls)

        for function in re.findall(functionPattern, text):
            call = {"location" : location, "function" : function, "validcall": 0}
            if call not in testCalls: testCalls.append(call)
        if tname not in test_locations: test_locations.append(tname)
        if location not in tested_locations: tested_locations.append(location)

    except IOError:
        print("WARNING: missing location %s" % tname)
        pass
    #endtry
#endfor <- TestLocations
tname = ''

# load the valid calls from the 'validcallsfortesting.txt' file and compare the test calls.
try: 
    with io.open(join('validcallsfortesting.txt'), 'rt', encoding='utf-8') as ifile:
        text = ifile.read()

    validCalls = [{"location": call[0], "function": call[1], "validcall": 0} for call in re.findall("(\$?\w+)(?:\:)(\w*)", text)]
    for call in validCalls:
        if call['location'] not in valid_locations: valid_locations.append(call['location'])
    for call in (call for call in testCalls if not call['validcall']):
        if call['location'] not in valid_locations:
            for update in (update for update in testCalls if update['location'] == call['location']):
                call['validcall'] = -2
                tested_locations.remove(call['location'])
        elif call['function'] == '' or call in validCalls:
            call['validcall'] = 1
        else: 
            call['validcall'] = -1
except FileNotFoundError as e: 
    raise SystemExit("ERROR: validcallsfortesting.txt doesn't exist, can't validate if tests are calling valid location. Please run callvalidator.py then run testbuilder.py again. REASON: %s" % e.strerror)    
except Exception as e:
    raise SystemExit(e)

iname = ''

# Create the `testvalidity_info.qsrc` file with the validity check results:
infoqsrc = join(testdir,"testvalidity_info.qsrc")
try:
    if isfile(infoqsrc):
        os.remove(infoqsrc)        
    
    with io.open(infoqsrc, 'w', encoding='utf-8') as ofile:
        ofile.write("#testvalidity_info\n")
        ofile.write("\n")
        ofile.write("_ISTEST = 1\n")
        ofile.write("\n")
        
        for entry in testCalls:
            ofile.write("_ISVALIDCALL['%s,%s']=%d\n" % (entry['location'], entry['function'], entry['validcall']))

        ofile.write("\n")
        ofile.write("--- testvalidity_info --------------------------------\n")

except IOError as e:
    raise SystemExit("ERROR: testvalidity_info.qsrc not created! REASON: %s" % e.strerror)

oname = ''

# Create a list of locations that are needed by the valid tested locations
checklist = tested_locations.copy()
for location in checklist:
    iname = location.replace("$","_")
    with io.open(join(idir,iname+'.qsrc'), 'rt', encoding='utf-8') as ifile:
        text = ifile.read()
    # We are interested only in gs and xgs calls, and only the location part.
    callLinePattern = "(?:gs|xgs)(?:\s*(?:'|\"))(\w+)(?:'|\")(?:(?:,\s*)(?:'|\")(?:\w*)(?:'|\"))?"
    dependencies = re.findall(callLinePattern, text)

    for dependency in dependencies:
        if dependency not in dependency_locations and dependency not in checklist:
            #checklist.append(dependency)
            dependency_locations.append(dependency)
    #endfor dependencies
#endfor <- tested_locations

# Add every `$LOCATIONNAME`, `$FUNCTIONAME`, `ISVALID` as an `_ISVALIDCALL['$LOCATIONNAME,$FUNCTIONNAME'] = ISVALID`
# line where `ISVALID` is `0` for `false` and `1` for `true`.


################################################################################################
#
# Create the `start.qsrc` file tests for the test suite.
#
#####

starqsrc = join(testdir,"start.qsrc")
try:
    
    if isfile(starqsrc): os.remove(starqsrc) 

    with io.open(starqsrc, 'w', encoding='utf-8') as ofile:
        ofile.write("# start\n")
        ofile.write("\n")
        ofile.write("killall\n")
        ofile.write("close all\n")
        ofile.write("usehtml = 1\n")
        ofile.write("debug = 1\n")
        ofile.write("showstat 0\n")
        ofile.write("showobjs 0\n")
        ofile.write("showinput 0\n")
        ofile.write("showacts 0\n")
        ofile.write("disablescroll = 1\n")
        ofile.write("$fname = 'Tahoma'\n")
        ofile.write("fsize = 12\n")
        #ofile.write("$onnewloc = 'testlocationlimiter'\n")
        ofile.write("  \n")
        ofile.write("!! ------------------------------------------------------------------------------------\n")
        ofile.write("!! Test Setup\n")
        ofile.write("!! ------------------------------------------------------------------------------------\n")
        ofile.write("\n")
        ofile.write("_ISTEST = 1\n")
        ofile.write("$_TESTSUITE = '%s'\n" % testsuite)
        ofile.write("$_TESTBUILDTIME = '%s'\n" % datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        ofile.write("$_TESTFILETIME = '%s'\n" % datetime.now().strftime('%Y%m%d-%H%M%S'))
        ofile.write("_STAT_BLOCKED = 1\n")
        ofile.write("\n")
        ofile.write("gs 'testvalidity_info'\n")
        ofile.write("\n")
        ofile.write("!! ------------------------------------------------------------------------------------\n")
        ofile.write("!! Call the tests to run\n")
        ofile.write("!! ------------------------------------------------------------------------------------\n")
        ofile.write("\n")

        for test in test_run_list: ofile.write("\t%s\n" % test)

        ofile.write("\n")
        ofile.write("!! ------------------------------------------------------------------------------------\n")
        ofile.write("!! Display the test results\n")
        ofile.write("!! ------------------------------------------------------------------------------------\n")
        ofile.write("gs 'testframework', 'displayTestResults'\n")
        ofile.write("\n")

        if save_enabled:
            ofile.write("!! ------------------------------------------------------------------------------------\n")
            ofile.write("!! Save the test results\n")
            ofile.write("!! ------------------------------------------------------------------------------------\n")
            ofile.write("\n")
            ofile.write("if _TESTSAVED = 0: gs 'testframework', 'saveTestResults'\n")
            ofile.write("\n")
        #endif <- saveallowed

        ofile.write("--- start --------------------------------\n")
except IOError as e:
    raise SystemExit("ERROR: start.qsrc could not be created! REASON: %s" % e.strerror)
#endtry

################################################################################################
#
# Create the `test_x.qproj` file to include all the test locations and the required game locations
#
#####
filename = "%s-%s-testsuite" % (project, testsuite)
qprojfile = "%s.qproj" % filename
try:
    if isfile(qprojfile):
        os.remove(qprojfile)        
    
    with io.open(qprojfile, 'w', encoding='utf-8') as ofile:
        ofile.write('<?xml version="1.0" encoding="utf-8"?>\n')
        ofile.write('<QGen-project version="4.0.0 beta 1">\n')
        ofile.write('\t<Structure>\n')

        ofile.write('\t\t<Folder name="framework" folder="%s">\n' % testdir)
        ofile.write('\t\t\t<Location name="start"/>\n')
        ofile.write('\t\t\t<Location name="testframework"/>\n')
        ofile.write('\t\t\t<Location name="testvalidity_info"/>\n')
        ofile.write('\t\t\t<Location name="testlocationlimiter"/>\n')
        ofile.write('\t\t</Folder>\n')

        ofile.write('\t\t<Folder name="test-suite" folder="%s">\n' % testdir)
        for location in test_locations:
            ofile.write('\t\t\t<Location name="%s"/>\n' % location)
        ofile.write('\t\t</Folder>\n')

        ofile.write('\t\t<Folder name="code-to-test" folder="%s">\n' % idir)
        for entry in tested_locations:
            ofile.write('\t\t\t<Location name="%s"/>\n' % entry)
        ofile.write('\t\t</Folder>\n')
        
        ofile.write('\t\t<Folder name="dependency-locations" folder="%s">\n' % idir)
        for entry in dependency_locations:
            ofile.write('\t\t\t<Location name="%s"/>\n' % entry)
        ofile.write('\t\t</Folder>\n')
        
        ofile.write('\t</Structure>\n')
        ofile.write('</QGen-project>\n')
except IOError as e:
    raise SystemExit("ERROR: testvalidity_info.qsrc not created! REASON: %s" % e.strerror)

oname = ''

# This will need to use the the locations used in the test files and other locations based on the 
# dependency graph. 

# Also can define some mandatory locations - `stat`, for example.

################################################################################################
#
# Create the *.txt file from *.qsrc for txt2game
#
####
tree = ET.parse(qprojfile)
root = tree.getroot()
txtfile = "%s.txt" % filename

with io.open(txtfile, 'w', encoding='utf-16', newline='\r\n') as ofile:
    try:
        for folder in root.iter('Folder'):
            dir = folder.attrib["folder"]
            for location in folder.iter('Location'):
                iname = location.attrib['name']
                iname = iname.replace("$","_")
                try:
                    with io.open(join(dir,iname + '.qsrc'), 'rt', encoding='utf-8') as ifile:
                        text = ifile.read()
                    # make sure there's a line at the end of file
                    # (why wouldn't there be one? WINDOWS!
                    if text[-1] != u'\n':
                        text += u'\n\n'

                    ofile.write(text)
                except IOError:
                    print("WARNING: missing location %s" % iname)
            #endfor <- locations
        #endfor <- folders

        # Writing a little file so the batch file knows what the .txt and .qsp file names are 
        with io.open("_temp-filename.txt", 'w', encoding='utf-8') as ofile:
            ofile.write(filename)

        if isfile(starqsrc): os.remove(starqsrc) 
        if isfile(infoqsrc): os.remove(infoqsrc)        
        if isfile(qprojfile): os.remove(qprojfile)
        
    except IOError as e:
        raise SystemExit("WARNING: %s was not created. Error: %s" % (txtfile, e.strerror))

