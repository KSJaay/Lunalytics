// import dependencies
import inquirer from 'inquirer';

// import local files
import logger from '../server/utils/logger.js';
import SQLite from '../server/database/sqlite/setup.js';
import { generateHash } from '../server/utils/hashPassword.js';

const questions = [
  { type: 'input', name: 'email', message: 'Enter email added:' },
];

const generatePassword = () => {
  const numbers = '1234567890';
  const alphaNumeric =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  const charLength = alphaNumeric.length;

  var password = '';

  for (let i = 0; i < 12; ++i) {
    password += alphaNumeric.charAt(Math.floor(Math.random() * charLength));
  }

  password += numbers.charAt(Math.floor(Math.random() * charLength));

  return password;
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
    const client = await SQLite.connect();

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
