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
    directory: path.resolve(
      process.cwd(),
      'shared',
      'validators',
      'notifications'
    ),
    extension: '.js',
  },
];

appriseDirs.forEach(({ directory, extension }) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  const filePath = path.join(directory, fileName.toLowerCase() + extension);
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

const notificationJson = path.resolve(
  process.cwd(),
  'app',
  'constant',
  'notifications.json'
);

const data = fs.readFileSync(notificationJson, 'utf-8');
const notifications = JSON.parse(data);

const notificationName =
  fileName.charAt(0).toUpperCase() + fileName.slice(1).toLowerCase();

if (!notifications[notificationName]) {
  notifications[notificationName] = {
    id: notificationName,
    name: notificationName,
    icon: `${notificationName.toLowerCase()}.svg`,
  };

  fs.writeFileSync(
    notificationJson,
    JSON.stringify(
      Object.keys(notifications)
        .sort()
        .reduce((obj, key) => {
          obj[key] = notifications[key];
          return obj;
        }, {}),
      null,
      2
    ),
    'utf-8'
  );
  logger.info(
    `Notification entry added for ${notificationName} in notifications.json. Please add ${notificationName.toLowerCase()}.svg`
  );
}
