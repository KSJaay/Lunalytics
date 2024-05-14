import '../scripts/loadEnv.js';

// import dependencies
import inquirer from 'inquirer';

// import local files
import logger from '../server/utils/logger.js';
import SQLite from '../server/database/sqlite/setup.js';
import { generateHash } from '../server/utils/hashPassword.js';

const questions = [
  { type: 'input', name: 'email', message: 'Enter email added: ' },
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
      logger.log(
        'RESET PASSWORD',
        'Please enter a valid email address.',
        'ERROR',
        false
      );
      return;
    }

    const email = answers.email.toLowerCase().trim();
    const client = await SQLite.connect();

    const emailExists = client('user').where({ email }).first();

    if (!emailExists) {
      logger.log(
        'RESET PASSWORD',
        'Email provided does not exist in the database.',
        'ERROR',
        false
      );
      return;
    }

    const newPassword = generatePassword();
    const hashedPassowrd = generateHash(newPassword);

    await client('user').where({ email }).update({ password: hashedPassowrd });

    logger.log(
      'RESET PASSWORD',
      `Password has been reset to: ${newPassword}`,
      'INFO',
      false
    );

    await client.destroy();
    process.exit(1);
  })
  .catch((error) => {
    logger.log('', error, 'ERROR', false);
    logger.log(
      'RESET PASSWORD',
      'Error resetting password, please try again.',
      'ERROR',
      false
    );

    process.exit(1);
  });
