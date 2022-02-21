#!/usr/bin/env node

import fs from 'fs';

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

// dir, travelDown = true, pathsArr
const dispFilesInDir = (parameters) => {
  const { dir, travelDown, pathsArr } = parameters;
  const missingDetails = dir === undefined;

  if (missingDetails) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
      if (dirent.isFile()) {
        pathsArr.push(`${dir}/${dirent.name}`);
      } else if (travelDown) {
        dispFilesInDir(`${dir}/${dirent.name}`);
      }
    });
  } else {
    console.error('You need to input a directory');
  }

  return pathsArr;
};

export { mkDir, dispFilesInDir };
