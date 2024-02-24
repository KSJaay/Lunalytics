const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { v4: uuidv4 } = require('uuid');
const logger = require('../server/utils/logger');

const questions = [
  {
    type: 'input',
    name: 'port',
    message: 'What port would you like to use?',
    default: 2308,
  },
  {
    type: 'input',
    name: 'jwtSecret',
    message: 'Enter JWT Secret Key: ',
    default: uuidv4(),
  },
  {
    type: 'list',
    name: 'setupType',
    message:
      'Select migration type (If automatic it will automatically migrate the database to the newest version on start up):',
    choices: ['automatic', 'manual'],
    default: 'automatic',
  },
];

inquirer
  .prompt(questions)
  .then((answers) => {
    const { port, jwtSecret, setupType } = answers;

    if (!port || !jwtSecret || !setupType) {
      logger.log('SETUP', 'Invalid input. Please try again.', 'ERROR', false);
      return;
    }

    const isIntRegex = /^\d+$/;

    if (!isIntRegex.test(port)) {
      logger.log('SETUP', 'Invalid port. Please try again.', 'ERROR', false);
      return;
    }

    if (jwtSecret.length < 10) {
      logger.log(
        'SETUP',
        'JWT Secret Key must be at least 10 characters long.',
        'ERROR',
        false
      );
      return;
    }

    logger.log('SETUP', 'Setting up application...', 'INFO', false);

    // write to config.json file
    const configPath = path.join(__dirname, '..', 'config.json');
    const config = {
      port,
      jwtSecret,
      setupType,
      version: require('../package.json').version,
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    logger.log('SETUP', 'Application setup successfully.', 'INFO', false);

    process.exit(0);
  })
  .catch((error) => {
    logger.log('', error, 'ERROR', false);
    logger.log(
      'SETUP',
      'Enable to setup application. Please try again.',
      'ERROR',
      false
    );

    process.exit(1);
  });
