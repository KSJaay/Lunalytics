// import node_modules
import fs from 'fs';
import path from 'path';

// import local files
import logger from '../server/utils/logger.js';

const [, , fileName] = process.argv;

if (!fileName) {
  logger.error('Please provide a file name as an argument.');
  process.exit(1);
}

const appriseDirs = [
  {
    directory: path.resolve(process.cwd(), 'shared', 'notifications'),
    extension: '.js',
  },
  {
    directory: path.resolve(process.cwd(), 'server', 'notifications'),
    extension: '.js',
  },
  {
    directory: path.resolve(
      process.cwd(),
      'app',
      'constant',
      'notifications',
      'layout'
    ),
    extension: '.ts',
  },
  {
    directory: path.resolve(process.cwd(), 'shared', 'validators'),
    extension: '.js',
  },
];

appriseDirs.forEach(({ directory, extension }) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  const filePath = path.join(directory, fileName + extension);
  try {
    fs.writeFileSync(filePath, '', { flag: 'wx' });
    logger.info(`File created: ${filePath}`);
  } catch (err) {
    if (err.code === 'EEXIST') {
      logger.warn(`File already exists: ${filePath}`);
    } else {
      logger.error(`Error creating file in ${filePath}: ${err.message}`);
    }
  }
});
