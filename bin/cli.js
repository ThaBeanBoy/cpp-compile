#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

import inquirer from 'inquirer';

import chalk from 'chalk';

// import { compile } from 'compile';
import { mkDir } from 'helpers';

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

mkDir('hello');
// compile();

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
