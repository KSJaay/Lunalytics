// import dependencies
import fs from 'fs';

// import local files
import { SQLite } from '../../server/database/sqlite/setup.js';
import { generateHash } from '../../shared/utils/hashPassword.js';
import logger from '../../shared/utils/logger.js';
import { loadJSON } from '../../shared/parseJson.js';

const loginDetails = loadJSON('../test/e2e/setup/fixtures/login.json');

const setupDatabase = async () => {
  if (fs.existsSync(`${process.cwd()}/server/database/sqlite/e2e-test.db`)) {
    fs.unlinkSync(`${process.cwd()}/server/database/sqlite/e2e-test.db`);
    logger.log('SETUP', 'Removed old database', 'INFO', false);
  }

  const sqlite = new SQLite();

  await sqlite.connect('e2e-test');
  await sqlite.setup();

  const { username, email, password } = loginDetails.ownerUser;

  await sqlite.client('user').insert({
    email: email.toLowerCase(),
    displayName: username,
    password: generateHash(password),
    avatar: null,
    permission: 1,
    isVerified: true,
  });

  logger.log('SETUP', 'Created owner user', 'INFO', false);

  return sqlite.client.destroy();
};

setupDatabase();
