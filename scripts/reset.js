// import dependencies
import inquirer from 'inquirer';

// import local files
import logger from '../server/utils/logger.js';
import database from '../server/database/connection.js';
import { generateHash } from '../server/utils/hashPassword.js';

const questions = [
  { type: 'input', name: 'email', message: 'Enter email added:' },
];

const generatePassword = () => {
  const alphaNumeric =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  const charLength = alphaNumeric.length;

  return (
    Array.from({ length: 12 })
      .map(() => alphaNumeric.charAt(Math.floor(Math.random() * charLength)))
      .join('') + `23`
  );
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
