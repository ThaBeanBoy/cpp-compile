#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';

const mkDir = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, (err) => {
      if (err) {
        console.log(err);
      }
      // else {
      //   console.log(`${path} created`);
      // }
    });
  }
};

// dir, travelDown = true,
const filesInDir = (parameters) => {
  // Destructuring the parameters object
  let { dir, travelDown, extNames } = parameters;

  // Default values
  travelDown = travelDown === undefined ? true : travelDown;

  const missingDetails = dir === undefined;
  // console.log(`helpers.js: \nfilesInDir() parameters`, parameters);

  let filePaths = [];

  // Getting all the files
  if (!missingDetails) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
      if (dirent.isFile()) {
        filePaths.push(`${dir}/${dirent.name}`);
      } else if (travelDown) {
        filesInDir(`${dir}/${dirent.name}`);
      }
    });

    // filtering based on extension name/s
    if (extNames !== undefined) {
      // Has to filter based on multiple file extensions
      if (Array.isArray(extNames)) {
        filePaths = filePaths.filter((file) =>
          extNames.some((ext) => path.extname(file) === ext)
        );
      }
      // Has to filter based on 1 ext name
      else {
        filePaths = filePaths.filter((file) => path.extname(file) === extNames);
      }
    }
  } else {
    consoleMessages.devErr(`fault in the directory provided: Dir('${dir}')`);
  }

  return filePaths;
};

const readFile = (filePath) => {
  const detailsAvailable = filePath !== undefined;

  if (detailsAvailable) {
    fs.readFileSync(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      return data;
    });
  } else {
    consoleMessages.devErr('There is something wrong with the path provided');
  }
};

const consoleMessages = {
  devErr: (msg) => {
    console.log(chalk.black.bgRedBright(msg));
    console.log(
      chalk.underline(
        'As a user, you are not supposed to see this... \nIf you do see this, you could help by reporting your issue\n'
      )
    );
  },
  compilerErr: (msg) => console.log(chalk.black.bgYellowBright(msg)),
  allGood: (msg) => console.log(chalk.bgGreen.black(msg)),
  allGoodNoBg: (msg) => console.log(chalk.green(msg)),
};

export { mkDir, filesInDir, readFile, consoleMessages };
