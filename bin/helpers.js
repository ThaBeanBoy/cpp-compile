#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

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

// dir, travelDown = true,
const filesInDir = (parameters) => {
  const { dir, travelDown, extNames } = parameters;
  const missingDetails = dir !== undefined;

  let filePaths = [];

  // Getting all the files
  if (missingDetails) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
      if (dirent.isFile()) {
        filePaths.push(`${dir}/${dirent.name}`);
      } else if (travelDown) {
        filesInDir(`${dir}/${dirent.name}`);
      }
    });
  } else {
    console.error('You need to input a directory');
  }

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
  return filePaths;
};

export { mkDir, filesInDir };
