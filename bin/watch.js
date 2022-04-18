const chokidar = require('chokidar');
const { filesInDir } = require('./helpers.js');

const watch = () => {
  chokidar.watch('./source/').on('all', (ev, path) => {
    console.log('changes made');
    console.log('ev: ', ev, '\npath: ', path);
  });
};

module.exports = watch;
