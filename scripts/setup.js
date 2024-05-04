import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { v4 as uuidv4 } from 'uuid';
import logger from '../server/utils/logger.js';
import packageJson from '../package.json' assert { type: 'json' };

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
    name: 'migrationType',
    message:
      'Select migration type (If automatic it will automatically migrate the database to the newest version on start up):',
    choices: ['automatic', 'manual'],
    default: 'automatic',
  },
];

inquirer
  .prompt(questions)
  .then((answers) => {
    const { port, jwtSecret, migrationType } = answers;

    if (!port || !jwtSecret || !migrationType) {
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
    const configPath = path.join(process.cwd(), 'config.json');
    const config = {
      port,
      jwtSecret,
      migrationType,
      version: packageJson.version,
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
