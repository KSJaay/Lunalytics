// import dependencies
import crypto from 'crypto';
import inquirer from 'inquirer';

// import local files
import logger from '../server/utils/logger.js';
import database from '../server/database/connection.js';
import { generateHash } from '../server/utils/hashPassword.js';

const questions = [
  { type: 'input', name: 'email', message: 'Enter email added:' },
];

const getRandomChar = (str) => {
  const index = crypto.randomInt(0, str.length);
  return str[index];
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generatePassword = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const allChars = letters + numbers;

  const passwordLength = 12;
  const password = [];

  password.push(getRandomChar(letters));

  password.push(getRandomChar(numbers));

  for (let i = password.length; i < passwordLength; i++) {
    password.push(getRandomChar(allChars));
  }

  return shuffle(password).join('');
};

inquirer
  .prompt(questions)
  .then(async (answers) => {
    if (!answers?.email) {
      logger.error('RESET PASSWORD', {
        message: 'Please enter a valid email address.',
      });
      return;
    }

    const email = answers.email.toLowerCase().trim();
    const client = await database.connect();

    const emailExists = await client('user').where({ email }).first();

    if (!emailExists) {
      logger.error('RESET PASSWORD', {
        message: 'Email provided does not exist in the database.',
      });

      process.exit(0);
    }

    const newPassword = generatePassword();
    const hashedPassowrd = generateHash(newPassword);

    await client('user').where({ email }).update({ password: hashedPassowrd });

    console.log(`Password has been reset to: ${newPassword}`);

    await client.destroy();
    process.exit(0);
  })
  .catch((error) => {
    logger.error('RESET PASSWORD', {
      message: 'Error resetting password, please try again.',
      error: error.message,
      stack: error.stack,
    });

    process.exit(0);
  });
