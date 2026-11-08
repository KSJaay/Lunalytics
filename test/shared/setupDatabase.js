// import dependencies
import fs from 'fs';

// import local files
import { Database } from '../../server/database/connection.js';
import { generateHash } from '../../server/utils/hashPassword.js';
import logger from '../../server/utils/logger.js';
import { loadJSON } from '../../shared/parseJson.js';

const loginDetails = loadJSON('test/e2e/setup/fixtures/login.json');

const setupDatabase = async () => {
  if (fs.existsSync(`${process.cwd()}/data/e2etest.db`)) {
    fs.unlinkSync(`${process.cwd()}/data/e2etest.db`);
    logger.info('SETUP', { message: 'Removed old database' });
  }

  const database = new Database();

  await database.connect('e2etest');
  await database.setup();

  const { username, email, password } = loginDetails.ownerUser;

  const ownerExists = await database.client('user').where({ email }).first();

  if (ownerExists) {
    logger.info('SETUP', { message: 'Owner user already exists' });
    return database.client.destroy();
  }

  await database.client('user').insert({
    email: email.toLowerCase(),
    displayName: username,
    password: generateHash(password),
    avatar: null,
    permission: 1,
    isVerified: true,
  });

  logger.info('SETUP', { message: 'Created owner user' });

  return database.client.destroy();
};

setupDatabase();
