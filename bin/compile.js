#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

import { mkDir, filesInDir } from './helpers.js';

// Parameters: compileSuccess: function, noErrors: function, noSource :function
const compile = (Parameters) => {
  let {
    compileSuccess,
    noErrors,
    noSource,
    noCppFiles,
    oFilesBuildError,
    exeBuildErr,
  } = Parameters;

  //   default values
  compileSuccess = compileSuccess !== undefined ? compileSuccess : () => {};
  noErrors = noErrors !== undefined ? noErrors : () => {};
  noSource =
    noSource !== undefined ? noSource : () => console.log('no source folder');
  oFilesBuildError =
    oFilesBuildError !== undefined
      ? oFilesBuildError
      : console.log('Error in building .o files');
  exeBuildErr =
    exeBuildErr !== undefined
      ? exeBuildErr
      : console.log('Err in building the executable');

  // if the source doesn't exeist, alert the cli
  noSource({
    rtnTrue: () => {
      /* 
        Make directories that may not be there
        Important directories: source, bin and ./bin/oFiles
      */
      mkDir('source');
      mkDir('./bin');
      mkDir('./bin/oFiles');

      // Make .o files
      // <> What should happen if there are no .cpp files
      const filePaths = filesInDir({
        dir: './source',
        travelDown: true,
        extNames: '.cpp',
      });

      // Continue with compilation if .cpp files are found, otherwise, execute the noCppFiles function
      const compileFiles = () => {
        for (const file of filePaths) {
          let oFileGenerationError = false;
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
              //! Delete any of the .o files that were built
              return;
            }
          });
        }

        // Making the exe file
        let exeBuildCommand = 'g++ -o bin/main ';
        const oFilesGenerated = filesInDir({
          dir: '.',
          travelDown: false,
          extNames: '.o',
        });
        oFilesGenerated.forEach(
          (file) => (exeBuildCommand += `${file.replace('./', '')} `)
        );
        console.log(exeBuildCommand);
        execSync(exeBuildCommand, (err, stdout, stderr) => {
          let exeBuildErr = false;
          if (err) {
            console.log(`error: ${err.message}`);
            exeBuildErr = true;
          } else if (stderr) {
            console.log(`stderr: ${stderr}`);
            exeBuildErr = true;
          }

          console.log(`stdout: ${stdout}`);

          if (exeBuildErr) {
            exeBuildErr();
            //! Delete any of the .o files that were built
            return;
          }
        });

        // Delete the old .o files and .exe
        filesInDir({
          dir: './bin/oFiles',
          travelDown: true,
          extNames: ['.o', '.exe'],
        }).forEach((file) => fs.unlinkSync(file, () => {}));

        // Place exe file and .o files in the bin
        filesInDir({
          dir: '.',
          travelDown: true,
          extNames: ['.o', '.exe'],
        }).forEach((file) => {
          // Moving .o files
          let newPath =
            path.extname(file) === '.o'
              ? `./bin/oFiles/${file.replace('./', '')}`
              : `./bin/`;

          fs.renameSync(file, newPath);
        });

        //<>   if the compilation is done with no errors, respond to the cli
      };

      filePaths.length !== 0
        ? compileFiles()
        : noCppFiles({ rtnTrue: compileFiles });
    },
  });
};

export default compile;
