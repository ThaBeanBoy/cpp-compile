const chokidar = require('chokidar');
const {
  filesInDir,
  cppExtensionNames,
  hFileExtensions,
  consoleMessages,
} = require('./helpers.js');

const path = require('path');

const watch = (compilationFunction) => {
  // const chokidarParameter = [
  //   ,
  // ];

  const chokidarEvents = (chokidarElement, ev) => {
    // !!!!! Original Code !!!!!
    // if (ev === 'change') {
    //   let filesThatWillChange = filesInDir({
    //     dir: './source',
    //     travelDown: true,
    //     extNames: [...cppExtensionNames, ...hFileExtensions],
    //   });

    //   // Unwatch cpp source files
    //   // console.log(watcher.getWatched());
    //   watcher.unwatch([...filesThatWillChange, './source/']);

    //   // compile, compilation also covers formatting files
    //   console.log(
    //     'files being watched before compiling: ',
    //     watcher.getWatched()
    //   );
    //   compilationFunction();

    //   // re-watch cpp source files
    //   // watcher.add([...filesThatWillChange, './source']);
    // }

    // !!!!! Experimental Code !!!!!
    chokidarElement.close().then(() => {
      // compilation
      // Restart chokidar
      // const newWatcher = chokidar.watch(...chokidarParameter).on('all', (ev) => {
      //   chokidarEvents(newWatcher, ev);
      // });
    });
  };

  const initialFilesParams = {
    dir: './source',
    travelDown: true,
    extNames: [...cppExtensionNames, ...hFileExtensions],
  };
  const initalFiles = filesInDir(initialFilesParams);

  const watcher = chokidar
    .watch(initalFiles, {
      ignored: /(\w+\.(?!cpp|cxx|c\+\+|h)|(^|[\/\\])\.\w+)/gm,
    })
    .on('change', (pathName) => {
      console.log(`${pathName} has been changed`);

      let filesThatWillChange = filesInDir({
        dir: './source',
        travelDown: true,
        extNames: [...cppExtensionNames, ...hFileExtensions],
      });

      // Unwatch cpp source files
      // console.log(watcher.getWatched());
      watcher.unwatch(filesThatWillChange);

      // compile, compilation also covers formatting files
      console.log(
        'files being watched before compiling: ',
        watcher.getWatched()
      );
      // compilationFunction();

      // re-watch cpp source files
      watcher.add(filesThatWillChange);
    })
    .on('raw', (event, pathName, details) =>
      console.log('Raw event info:', event, pathName, details)
    )
    .on('error', (err) => consoleMessages.devErr(err));

  // Watching changes to the source directory
  chokidar
    .watch('./source')
    .on('add', (newFileName) => {
      // Add the files to watchlist if the file is a cpp / h file & not an initial files
      const isCppOrH = [...cppExtensionNames, ...hFileExtensions].some(
        (ext) => ext === path.extname(newFileName)
      );

      // const isInitialFile = initalFiles
      if (isCppOrH) {
        console.clear();
        console.log(`${newFileName.replace('\\', '\\\\')} should be added`);
        watcher.add(newFileName);
        console.log(watcher.getWatched());
      }
    })
    .on('unlink', (deletedFileName) => {
      // remove from watch list
      console.clear();
      console.log(`deleted ${deletedFileName}`);
      console.log(watcher.getWatched());
    });
};

module.exports = watch;
