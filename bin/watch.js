const { filesInDir } = require('./helpers.js');

// ! Website that may help
// https://www.geeksforgeeks.org/node-js-fs-watchfile-method/

// Compile on file saves,
// This will make life easier because you won't have to continously compile manually, you just run da ting
console.log(
  filesInDir({
    dir: './source',
    travelDown: true,
    extNames: '.cpp',
  })
);
