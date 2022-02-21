#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

import { mkDir, filesInDir } from './helpers.js';

// Parameters: compileSuccess: function, noErrors: function, noSource :function
const compile = (Parameters) => {
  let { compileSuccess, noErrors, noSource, oFilesBuildError } = Parameters;

  //   default values
  compileSuccess = compileSuccess !== undefined ? compileSuccess : () => {};
  noErrors = noErrors !== undefined ? noErrors : () => {};
  noSource =
    noSource !== undefined ? noSource : () => console.log('no source folder');
  oFilesBuildError =
    oFilesBuildError !== undefined
      ? oFilesBuildError
      : console.log('Error in building .o files');

  /* 
  Make directories that may not be there
  Important directories: source, bin and ./bin/oFiles
  */
  //<>   if the source doesn't exeist, alert the cli
  mkDir('source');
  mkDir('./bin');
  mkDir('./bin/oFiles');

  // Make .o files
  const filePaths = filesInDir({
    dir: './source',
    travelDown: true,
    extNames: '.cpp',
  });

  let oFileGenerationError = false;
  for (const file of filePaths) {
    execSync(`g++ -c ${file}`, (err, stdout, stderr) => {
      if (err) {
        console.log(`error: ${err.message}`);
        oFileGenerationError = true;
      } else if (stderr) {
        console.log(`stderr: ${stderr}`);
        oFileGenerationError = true;
      }

      console.log(`stdout: ${stdout}`);

      if (oFileGenerationError) {
        oFilesBuildError();
        // Delete any of the .o files that were built
        return;
      }
    });
  }

  // Making the exe file
  let exeBuildCommand = 'g++ -o main ';
  const oFilesGenerated = filesInDir({
    dir: '.',
    travelDown: false,
    extNames: '.o',
  });
  oFilesGenerated.forEach(
    (file) => (exeBuildCommand += `${file.replace('./', '')} `)
  );
  console.log(exeBuildCommand);
  // const oFilesGenerated =
  // Delete the old .o files and .exe
  // Place exe file in the bin
  // Place .o files in bin/oFiles

  // Moving all the .o files into the ./bin/oFiles/

  //<>   if the compilation is done with no errors, respond to the cli
};

export default compile;
