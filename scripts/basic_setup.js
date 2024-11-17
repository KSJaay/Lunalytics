// import dependencies
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// import local files
import logger from '../server/utils/logger.js';
import { loadJSON } from '../shared/parseJson.js';
const packageJson = loadJSON('../package.json');

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

try {
  logger.info('SETUP', { message: 'Setting up application...' });

  // write to config.json file
  const configPath = path.join(process.cwd(), 'config.json');
  const config = {
    port: 2308,
    database: { name: 'lunalytics' },
    jwtSecret: uuidv4(),
    migrationType: 'automatic',
    version: packageJson.version,
  };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  logger.info('SETUP', { message: 'Application setup successfully.' });

  process.exit(0);
} catch (error) {
  logger.error('SETUP', {
    message: 'Unable to setup application. Please try again.',
    error: error.message,
    stack: error.stack,
  });

  process.exit(1);
}
