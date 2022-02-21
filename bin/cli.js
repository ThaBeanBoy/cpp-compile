#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

import inquirer from 'inquirer';

import chalk from 'chalk';

import compile from './compile.js';
import { mkDir } from './helpers.js';

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
  noSource: () => {
    console.error(chalk.underline.bgRed.black('There is no source'));
    inquirer.prompt({
      name: 'generateDefaultSource',
      message: 'Should I generate the default source folder for you?',
      type: 'confirm',
    });
  },
  oFilesBuildError: () => console.log(errChalk('Error in building .o Files')),
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
