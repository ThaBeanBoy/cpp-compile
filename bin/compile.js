#!/usr/bin/env node

var commandExistsSync = require('command-exists').sync;

const { format } = require('astyle');

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const {
  mkDir,
  filesInDir,
  consoleMessages,
  readFile,
  isRunning,
} = require('./helpers.js');

// Parameters: compileSuccess: function, noErrors: function, noSource :function
const compile = (Parameters) => {
  const bln_gppAvailable = commandExistsSync('g++');
  const mainIsRunning = isRunning('main.exe');

  if (bln_gppAvailable && !mainIsRunning) {
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
        : consoleMessages.compilerErr('Error in building .o files');
    exeBuildErr =
      exeBuildErr !== undefined
        ? exeBuildErr
        : consoleMessages.compilerErr('Err in building the executable');

    // if the source doesn't exeist, alert the cli
    // fs.existsSync('./source')?
    const theresSourceCompile = () => {
      /* 
          Make directories that may not be there
          Important directories: source, bin and ./bin/oFiles
        */
      mkDir('./source');
      mkDir('./bin');
      mkDir('./bin/oFiles');

      // Make .o files
      // <> What should happen if there are no .cpp files
      let filePaths = filesInDir({
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

              // Delete any of the .o files that were built
              filesInDir({
                dir: '.',
                travelDown: false,
                extNames: '.o',
              }).forEach((file) => {
                fs.unlinkSync(file, () => {});
              });

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

        // console.log('ofiles', oFilesGenerated);
        // console.log('building exe file', exeBuildCommand);
        execSync(exeBuildCommand, (err, stdout, stderr) => {
          let thereWasExeBuildErr = false;
          if (err) {
            console.log(`error: ${err.message}`);
            thereWasExeBuildErr = true;
          } else if (stderr) {
            console.log(`stderr: ${stderr}`);
            thereWasExeBuildErr = true;
          }

          console.log(`stdout: ${stdout}`);

          if (thereWasExeBuildErr) {
            exeBuildErr();

            // Delete any of the .o files that were built
            filesInDir({
              dir: '.',
              travelDown: false,
              extNames: '.o',
            }).forEach((file) => {
              fs.unlinkSync(file, () => {});
            });

            return;
          }
        });

        // Delete the old .o files and .exe
        filesInDir({
          dir: './bin',
          travelDown: true,
          extNames: ['.o', '.exe'],
        }).forEach((file) => fs.unlinkSync(file, () => {}));

        // console.log(
        //   filesInDir({
        //     dir: '.',
        //     travelDown: false,
        //     extNames: ['.o', '.exe'],
        //   })
        // );
        // Place exe file and .o files in the bin
        filesInDir({
          dir: '.',
          travelDown: false,
          extNames: ['.o', '.exe'],
        }).forEach((file) => {
          // Moving .o files
          let newPath =
            path.extname(file) === '.o'
              ? `./bin/oFiles/${file.replace('./', '')}`
              : `./bin/${file.replace('./', '')}`;

          // console.log(newPath);
          fs.renameSync(file, newPath);
        });

        // formating .cpp and .h files with astyle
        filesInDir({
          dir: './source',
          travelDown: true,
          extNames: ['.cpp', '.h'],
        }).forEach((file) => {
          format(readFile(file), '--style=allman').then((res) =>
            fs.writeFileSync(file, res)
          );
        });

        // if the compilation is done with no errors, respond to the cli
        consoleMessages.allGood(' exe files ready to go!! ');
      };

      filePaths.length !== 0
        ? compileFiles()
        : noCppFiles({
            rtnTrue: () => {
              // Generate main.cpp file in source
              consoleMessages.devErr('Making main.cpp');
              const cppFileBoilerPlate = `#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << "Hello world" << endl;\n\n\treturn 0;\n}\n// Auto generated file.`;
              fs.appendFileSync('source/main.cpp', cppFileBoilerPlate);

              // Updating the filePaths,  so it's now aware of the generated files
              filePaths = filesInDir({
                dir: './source',
                travelDown: true,
                extNames: '.cpp',
              });

              compileFiles();
            },
          });
    };

    fs.existsSync('./source')
      ? theresSourceCompile()
      : noSource({
          rtnTrue: theresSourceCompile,
        });
  }
  // g++ not available
  else if (!bln_gppAvailable) {
    consoleMessages.compilerErr(
      ' Please get Mingw-w64 or g++, You can use the following link: https://www.msys2.org/ '
    );
  }
  // main is running
  else {
    consoleMessages.compilerErr(
      " Couldn't compile: <main.exe> is still running "
    );
  }
};

module.exports = compile;
