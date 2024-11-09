// import dependencies
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { v4 as uuidv4 } from 'uuid';

// import local files
import logger from '../server/utils/logger.js';
import { loadJSON } from '../shared/parseJson.js';
const packageJson = loadJSON('../package.json');

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
    type: 'input',
    name: 'databaseName',
    message: 'Enter Database Name: ',
    default: 'Lunalytics',
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

const configExists = () => {
  const configPath = path.join(process.cwd(), 'config.json');
  return fs.existsSync(configPath);
};

if (configExists()) {
  logger.error('SETUP', {
    message:
      'Configuration file already exists. Please manually edit to overwrite or delete the file.',
  });
  process.exit(0);
}

inquirer
  .prompt(questions)
  .then((answers) => {
    const { port, jwtSecret, migrationType, databaseName } = answers;

    if (!port || !jwtSecret || !migrationType || !databaseName) {
      logger.error('SETUP', { message: 'Invalid input. Please try again.' });
      return;
    }

    const isIntRegex = /^\d+$/;

    if (!isIntRegex.test(port)) {
      logger.error('SETUP', { message: 'Invalid port. Please try again.' });
      return;
    }

    if (jwtSecret.length < 10) {
      logger.error('SETUP', {
        message: 'JWT Secret Key must be at least 10 characters long.',
      });
      return;
    }

    logger.info('SETUP', { message: 'Setting up application...' });

    // write to config.json file
    const configPath = path.join(process.cwd(), 'config.json');
    const config = {
      port,
      jwtSecret,
      migrationType,
      version: packageJson.version,
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    logger.info('SETUP', { message: 'Application setup successfully.' });

    process.exit(0);
  })
  .catch((error) => {
    logger.error('SETUP', {
      message: 'Enable to setup application. Please try again.',
      error: error.message,
      stack: error.stack,
    });

    process.exit(1);
  });
