import {glob} from 'glob';
import fs from 'node:fs';
import path from "path";

import { Command } from "commander";

import WorkerPool from './worker_pool.js';
import os from 'node:os';

const VERSION = 3;
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
  .option('-ve, --verbose-errors','prints out complete error messages where possible')
  ;

program.parse(process.argv);
const options = program.opts();

console.log('START CONVERSION');
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

const failedFiles = [];
const pool = new WorkerPool(os.availableParallelism());

let percentageDisplayed = 0;

const convertPromise = new Promise((resolve, reject) => {

    let finished = 0;
    if(!filePaths.length){
        resolve("DONE");
        return;
    }

    for (let filePath of filePaths) {
        pool.runTask({
            VERSION: VERSION,
            filePath: filePath,
            outPath: outPath,
            generatedFilesPrefix: generatedFilesPrefix,
            options:options,
        }, (err, result) => {
            const wasSuccessful = (result[0] == 0);
            const message = result[1];

            if(!wasSuccessful){
                const displayFilePath = baseFileName(filePath);
                if(!options.verboseErrors)
                    console.error(`${displayFilePath} failed`);
                failedFiles.push(filePath);
            }

            if (++finished === filePaths.length){
                resolve("DONE");
            }else{
                const percentageFinished = finished / filePaths.length * 100;

                if(percentageFinished > Math.floor(percentageDisplayed/5 +1)*5){
                    console.log(`${Math.round(percentageFinished)}% done`);
                    percentageDisplayed = percentageFinished;
                }

            }
        });
    }
});
await convertPromise;

pool.close();

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

const resourcesPath = path.join(outPath,resourcesFilesPrefix);
fs.rmSync(resourcesPath, { recursive: true, force: true });
fs.cpSync("./resources", resourcesPath, {recursive: true});


const executionTime =  (new Date()).getTime() - startTime;
console.log('ENDED CONVERSION'.padEnd(30,'.')+ ' '+executionTime+' ms'+` (${filePaths.length-failedFiles.length} of ${filePaths.length} successful)`);

//https://stackoverflow.com/a/25221100/7200161
function baseFileName(fullpath){
    return fullpath.split('\\').pop().split('/').pop();
}
