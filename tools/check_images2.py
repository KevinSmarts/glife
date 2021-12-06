#!/usr/bin/env python

import io
import os
import re
import sys

#path = os.getcwd()
#print path

startpattern = """images/"""
imgFormats = ['jpg','gif','png','mp4']

images = []
jmages = []

filename_false = 'LinksToSkip.txt'
with io.open(filename_false, 'r', encoding='UTF-8') as file:
    linesfalse = file.readlines()
    linesfalse = [line.rstrip() for line in linesfalse]
file.close()


ifile = io.open(
    "glife.txt",
    mode='rt',
    encoding='utf-16'
)
text = ifile.read()
for match in re.finditer(r"images.+?[.](gif|jpg|png|mp4)", text, flags=re.U):
    imgfile = match.group().encode("utf-8")
    randmatch = re.search(r"'\s*[+]\s*rand\s*[(]\s*(\d+)\s*[,]\s*(\d+)\s*[)]\s*[+]\s*'", imgfile)
    if randmatch != None:
        for i in range(int(randmatch.group(1)), 1+int(randmatch.group(2))):
            images.append(re.sub(r"'\s*[+]\s*rand\s*[(].*?[)]\s*[+]\s*'", str(i), imgfile))
    else:
        images.append(imgfile)

ifile.close()
for image in images:
    ex = 0
    for jmage in jmages:
        if image == jmage:
            ex = 1
            break
    if ex == 0:
        ex = 0
        for line in linesfalse:
            if image == line:
                ex = 1
                break
        if ex == 0:
            jmages.append(image)

for image in jmages:
    if not re.search(r"[<$]", image) and not os.path.isfile(image):
        print "Image not found:", image

