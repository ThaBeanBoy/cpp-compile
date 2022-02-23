#!/usr/bin/env node

import fs from 'fs';

import inquirer from 'inquirer';
import chalk from 'chalk';

import compile from './compile.js';

// console.log('Welcome to my ' + chalk.underline('CPP Compiler'));
// inquirer.prompt([
//   {
//     type: 'list',
//     name: 'findOutMethod',
//     message: 'How did you find this terminal?',
//     choices: ['Youtube Video', 'Internet', 'Friend recommendation'],
//     default: 'Youtube Video',
//   },
// ]);

// mkDir('hello');
const errChalk = (msg) =>
  chalk.underline.bgRed.black('Error: ') +
  chalk.underline.bgRed.black(msg) +
  '';

compile({
  noSource: (params) => {
    const { rtnTrue, rtnFalse } = params;

    console.log(chalk.underline.bgRed.black('There is no source'));
    console.log('');

    inquirer
      .prompt({
        name: 'init',
        type: 'confirm',
        message:
          'It seems like there are no source files, your project might not have been initialised, should I initialise?',
      })
      .then((answer) => {
        const { init } = answer;

        if (init) {
          // Call the init function

          // Returning false so the compile module doesn't do anything
          return rtnFalse();
        } else {
          inquirer
            .prompt({
              name: 'makeDirs',
              type: 'confirm',
              message: 'Should I make the source and bin folder for you?',
            })
            .then((answer) => (answer.makeDirs ? rtnTrue() : rtnFalse()));
        }
      });
  },

  noCppFiles: (params) => {
    const { rtnTrue, rtnFalse } = params;

    inquirer
      .prompt({
        name: 'InjectCppFile',
        type: 'confirm',
        message:
          'There are no .cpp files in your source, should I generate a default main.cpp file in your source?',
      })
      .then((answer) => {
        const { InjectCppFile } = answer;

        if (InjectCppFile) {
          console.log(
            `def main.cpp exist: ${fs.existsSync('./defaultFiles/main.cpp')}`
          );

          // rtnTrue();
        } else {
          rtnFalse();
        }
      });
  },

  oFilesBuildError: () => console.log(errChalk('Error in building .o Files')),

  exeBuildErr: () => console.log(errChalk('Erro in building the executable')),
});
// console.log(errChalk('Lol, no error'));

/* 
  --help: list all possible commands
  run: just runs the cpp code
  watch: makes exe and .o files and everything whenever a file is changed and/or saved
  compile: simply compiles and stuff
  
*/

// fs.readFile('compile.config.json', (err, data) => {
//   if (err) {
//     // No config file
//     // console.log('No config file');
//     inquirer
//       .prompt([
//         {
//           type: 'confirm',
//           name: 'makeConfig',
//           message: 'Should I generate a config file?',
//         },
//       ])
//       .then((answers) => {
//         console.log(answers);
//       });
//   } else {
//     const config = JSON.parse(data);
//     console.log(config);
//   }
// });
