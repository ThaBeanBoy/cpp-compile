#!/usr/bin/env node

import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import { execSync } from 'child_process';

const mkDir = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`${path} created`);
      }
    });
  }
};

fs.readFile('compile.config.json', (err, data) => {
  if (err) {
    // No config file
    // console.log('No config file');
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'makeConfig',
          message: 'Should I generate a config file?',
        },
      ])
      .then((answers) => {
        console.log(answers);
      });
  } else {
    const config = JSON.parse(data);
    console.log(config);
  }
});
