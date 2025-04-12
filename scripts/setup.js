// import dependencies
import fs from 'fs';
import path from 'path';

// import local files
import logger from '../server/utils/logger.js';

const configExists = () => {
  const configPath = path.join(process.cwd(), 'data', 'config.json');
  return fs.existsSync(configPath);
};

if (configExists()) {
  logger.notice('SETUP', {
    message:
      'Configuration file already exists. Please manually edit to overwrite or delete the file.',
  });
  process.exit(0);
}

try {
  logger.info('SETUP', { message: 'Creating config file...' });
  // create data directory if it does not exist
  if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'));
  }

  // create config.json file
  const configPath = path.join(process.cwd(), 'data', 'config.json');

  fs.writeFileSync(configPath, JSON.stringify({}, null, 2));
  logger.info('SETUP', { message: 'Successfully created config file.' });

  process.exit(0);
} catch (error) {
  logger.error('SETUP', {
    message: 'Unable to setup application. Please try again.',
    error: error.message,
    stack: error.stack,
  });

  process.exit(1);
}
