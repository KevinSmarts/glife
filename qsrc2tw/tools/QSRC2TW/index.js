import qsrc2tw from "./src/qsrc2tw.js";

import {glob} from 'glob';
import fs from 'node:fs';
import path from "path";

import { Command } from "commander";
import md5 from "./src/misc/md5.js";

const VERSION = 1;
const generatedFilesPrefix = '-generated';
const resourcesFilesPrefix = '+resources';

const program = new Command();
program
  .name('QSP TO Sugarcube')
  .description('CLI to Convert Quest Soft sourcecode to Twine Sugarcube')
  .version('0.0.1')
  .option('-in, --input-file-path <path>','the path where the qsrc-files are')
  .option('-out, --output-file-path <path>','the path where the tw-files go')
  .option('-f, --single-file <path>','only converts the specified file')
  .option('-fs, --multiple-files-from-file <path>','only converts the files specified in the input file')
  .option('-outff, --failed-files-output-path <path>','path of the failed files file')
  .option('-sff, --skip-failedfiles-file','skips creation of the failed files file')
  ;

program.parse(process.argv);
const options = program.opts();

console.log('START CONVERTION');
const startTime = (new Date()).getTime();

const inPath = options.inputFilePath ?? './in';
const outPath =  options.outputFilePath ?? './out';
const failedFilesPath = options.failedFilesOutputPath ?? "./failedFiles.log";

var filePaths = [];
try{
    if(options.singleFile)
        filePaths = [options.singleFile];
    else if(options.multipleFilesFromFile){
        let multipleFilesFromFilePath = options.multipleFilesFromFile;
        if(multipleFilesFromFilePath == "ff")
            multipleFilesFromFilePath = failedFilesPath;
        const data = fs.readFileSync(multipleFilesFromFilePath, 'utf8');
        filePaths = data.split('\n');
    }
    else{
        const searchArgument = path.join(inPath,'**/*.qsrc');
        filePaths = await glob(searchArgument.replace(/\\/g,'/'));
    }
}catch(e){
    console.error("Error retrieving filePaths:",e);
}

fs.mkdir(path.join(outPath,generatedFilesPrefix), { recursive: true }, (err) => {
  if (err) throw err;
});

//https://stackoverflow.com/a/25221100/7200161
function baseFileName(fullpath){
    return fullpath.split('\\').pop().split('/').pop();
}


async function convertFile(filePath){
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            const startTime = (new Date()).getTime();
            const codeHash = md5(data);
            const baseFileNameStr = baseFileName(filePath);
            const outFilePath = path.join(outPath,generatedFilesPrefix,baseFileNameStr.split('.')[0]+'.tw');

            if((data.split('\n')?.[1]).startsWith("!! SKIP_QSRC2TW")){
                resolve("SKIP");
                return;
            }

            if (fs.existsSync(outFilePath)) {

                try{
                    const secondLineData = fs.readFileSync(outFilePath, "utf-8").split('\n')[1];
                    const qsrc2twResultMatch = secondLineData.match(/<!--\s*qsrc2twResult=({.*})\s*-->/);
                    if(qsrc2twResultMatch){
                        const qsrc2twResult = JSON.parse(qsrc2twResultMatch[1]);

                        if((qsrc2twResult.code && codeHash == qsrc2twResult.code) &&
                            (qsrc2twResult.version && VERSION == qsrc2twResult.version)){
                                resolve("EXISTS");
                                return;
                        }
                    }
                }
                catch(e){

                }
            }


            try{
                const twineCode = qsrc2tw(data, true)
                                    .split('\n')
                                    .toSpliced(1,0,`<!--qsrc2twResult={"version":${VERSION},"code":"${codeHash}","time":"${(new Date().toISOString())}"}-->`)
                                    .join('\n');

                fs.writeFile(outFilePath, twineCode, err => {
                    if (err) {
                        console.error(err);
                    } else {
                    }
                });

                const executionTime =  (new Date()).getTime() - startTime;

                console.log(`${baseFileNameStr.padEnd(30,'.')} ${executionTime} ms`);

                resolve("SUCCESS");
            }catch(e){
                console.error(`Error in "${baseFileNameStr}". No output was generated`, e);
                reject(e);
            }
        });
    });
}

const failedFiles = [];
var promises = [];
for(let filePath of filePaths){
    const convertPromise = convertFile(filePath);
    promises.push(convertPromise);
    convertPromise.catch((e)=>{
        failedFiles.push(filePath);
    });
}


const allPromises = Promise.allSettled(promises);
await allPromises;

if(!options.skipFailedfilesFile){
    const contentsOfFailedFilesFile = failedFiles.sort((a, b) => a.localeCompare(b)).join("\n");
    fs.writeFile(failedFilesPath, contentsOfFailedFilesFile , err => {
        if (err) {
            console.error(err);
        } else {
            // file written successfully
        }
    });
}

fs.cpSync("./resources", path.join(outPath,resourcesFilesPrefix), {recursive: true});


const executionTime =  (new Date()).getTime() - startTime;
console.log('ENDED CONVERSION'.padEnd(30,'.')+ ' '+executionTime+' ms');

