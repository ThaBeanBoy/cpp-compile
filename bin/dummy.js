import inquirer from 'inquirer';

// Questinos, Answers
inquirer
  .prompt(
    {
      type: 'list',
      name: 'Question1',
      message: 'This is question 1',
      choices: ['Main.cpp', 'James.cpp', 'Oupa.cpp'],
    },
    {}
  )
  .then((answers) => {
    console.log(answers);
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
