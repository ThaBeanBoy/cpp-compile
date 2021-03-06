#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');

const chalk = require('chalk');
const { stderr } = require('process');

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
  let { dir, travelDown, extNames, filePaths } = parameters;

  // Default values
  travelDown = travelDown === undefined ? false : travelDown;
  filePaths = filePaths === undefined ? [] : filePaths;

  // Getting all the files
  const detailsAvailable = dir !== undefined;
  if (detailsAvailable) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
      if (dirent.isFile()) {
        filePaths.push(`${dir}/${dirent.name}`);
      } else if (travelDown) {
        filesInDir({
          dir: `${dir}/${dirent.name}`,
          travelDown: true,
          extNames: extNames,
          filePaths: filePaths,
        });
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
        filePaths = filePaths.filter((file) => {
          // file === extNames ? console.log(`filtered out - ${file}`) : {};
          return path.extname(file) === extNames;
        });
      }
    }
  } else {
    consoleMessages.devErr(`fault in the directory provided: Dir('${dir}')`);
    // throw err;
  }

  return filePaths;
};

const readFile = (filePath) => {
  const detailsAvailable = filePath !== undefined;

  if (detailsAvailable) {
    return (fileContents = fs.readFileSync(filePath, { encoding: 'utf-8' }));
  } else {
    consoleMessages.devErr('There is something wrong with the path provided');
    return '';
  }
};

const isRunning = (file) => {
  // largely based on this: https://stackoverflow.com/questions/38033127/node-js-how-to-check-a-process-is-running-by-the-process-name
  const platform = process.platform;
  let cmd = '';

  switch (platform) {
    case 'win32':
      cmd = 'tasklist';
      break;

    case 'linux':
      cmd = 'ps -A';
      break;

    case 'darwin':
      cmd = `ps -ax | grep ${file}`;
      break;

    default:
      consoleMessages.compilerErr(
        'Compile Error: ' +
          "Couldn't not tell if your executeable is running based, you can notify us by telling us what Operating System you running on"
      );
      break;
  }

  const stdOut = execSync(cmd).toString('utf-8');
  return stdOut.toLowerCase().indexOf(file.toLowerCase()) > -1;
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

module.exports = {
  mkDir,
  filesInDir,
  readFile,
  isRunning,
  consoleMessages,
};
