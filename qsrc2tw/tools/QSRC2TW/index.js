import qsrc2tw from "./src/qsrc2tw.js";
import npcInit from "./src/npcInit.js";
import skillDefinitions from "./src/skillDefinitions.js";

import {glob} from 'glob';
import fs from 'node:fs';
import path from "path";

import { Command } from "commander";
import md5 from "./src/misc/md5.js";

const VERSION = 2;
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


let consoleActive = true;
consoleOverwrite();
function consoleOverwrite(){
    //https://stackoverflow.com/a/30197438/7200161
    // define a new console
    var consoleOverwrite=(function(oldCons){
        return {
            log: function(text){
                if(consoleActive)
                    oldCons.log(text);
            },
            info: function (text) {
                if(consoleActive)
                    oldCons.info(text);
            },
            warn: function (text) {
                if(consoleActive)
                    oldCons.warn(text);
            },
            error: function (text) {
                if(consoleActive)
                    oldCons.error(text);
            }
        };
    }(console));

    //Then redefine the old console
    console = consoleOverwrite;
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

            const baseFileNameStr = baseFileName(filePath);
            const outFilePath = path.join(outPath,generatedFilesPrefix,baseFileNameStr.split('.')[0]+'.tw');
            const outFilePathTS = path.join(outPath,generatedFilesPrefix,baseFileNameStr.split('.')[0]+'.ts');

            const qsp2twOptions = data.split('\n')?.[1];
            if(qsp2twOptions.startsWith("!! SKIP_QSRC2TW")){
                if(fs.existsSync(outFilePath))
                    fs.unlink(outFilePath,(err) => {if (err) throw err;});
                if(fs.existsSync(outFilePathTS))
                    fs.unlink(outFilePathTS,(err) => {if (err) throw err;});
                resolve("SKIP");
                return;
            }



            //#region Skip File Output if outfile exists, is based on the same codebase (determined by hash) and has used the same compier-version
                const codeHash = md5(data);
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
                        //Something unexpected happens. No need to handle this, because we'll just run the default file-processing.
                    }
                }
            //#endregion

            var convertMode = "default";

            if(qsp2twOptions.startsWith("!! QSRC2TW_module")){
                convertMode = qsp2twOptions.trim().split(" ").toReversed()[0];
            }


            /**
             * Return value is Array [TwineCode, TSCode]. TwineCode must not be null.
             */
            var convertFunction = (code)=>[null,null];
            switch (convertMode) {
                case "default": convertFunction = (code) => [qsrc2tw(code, true),null]; break;
                case "npcInit": convertFunction = (code) => npcInit(code); break;
                case "stat_sklattrib_lvlset": convertFunction = (code) => skillDefinitions(code); break;
                default:
                    console.warn("Unreckognized Convert Mode");
                    break;
            }


            try{
                let twineCode = "";
                consoleActive = options.verboseErrors;
                let twineCodeRaw = undefined;
                let tsCodeRaw = undefined;
                try{
                    [twineCodeRaw,tsCodeRaw] = convertFunction(data);
                }
                catch(e){
                    throw e;
                }
                finally{
                    consoleActive = true;
                }
                if(!twineCodeRaw){
                    console.error("Twine Code must be generated by every converMode");
                    reject("Invalid convertFunction");
                    return;
                }else{
                    twineCode = twineCodeRaw.split('\n')
                                    .toSpliced(1,0,`<!--qsrc2twResult={"version":${VERSION},"code":"${codeHash}","time":"${(new Date().toISOString())}"}-->`)
                                    .join('\n');
                    fs.writeFile(outFilePath, twineCode, err => {
                        if (err) {
                            console.error(err);
                        } else {
                        }
                    });
                }


                if(!tsCodeRaw){
                    if(fs.existsSync(outFilePathTS))
                        fs.unlink(outFilePathTS,(err) => {if (err) throw err;});
                }else{
                    fs.writeFile(outFilePathTS, tsCodeRaw, err => {
                        if (err) {
                            console.error(err);
                        } else {
                        }
                    });
                }

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

const resourcesPath = path.join(outPath,resourcesFilesPrefix);
fs.rmSync(resourcesPath, { recursive: true, force: true });
fs.cpSync("./resources", resourcesPath, {recursive: true});


const executionTime =  (new Date()).getTime() - startTime;
console.log('ENDED CONVERSION'.padEnd(30,'.')+ ' '+executionTime+' ms');

