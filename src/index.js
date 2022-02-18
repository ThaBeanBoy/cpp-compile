// var inquirer = require('inquirer');

inquirer
  .prompt([
    {
      type: 'list',
      message: 'Keep .o files?',
      name: 'keepOfiles',
      choices: ['Yes', 'No'],
    },
  ])
  .then(({answers}) => {
    // Use user feedback for... whatever!!
    console.log(answers);
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });

// console.log(process.argv.slice(2));

let process = process.argv.slice(2);

switch (process[0]) {
  case 'init':
    console.log('Initialise');
    break;

  case 'compile':
    console.log('compile');
    break;

  case 'compile-watch':
    console.log('compile-watch');
    break;
}

// if (process[0] === 'init') {
//   console.log('init');
// } else if (process[0] === 'compile') {
//   console.log('compile');
// } else if (process[0] === 'compile-watch') {
//   console.log('watch');
// }
