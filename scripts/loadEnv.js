const fs = require('fs');
const path = require('path');
const logger = require('../server/utils/logger');

const configPath = path.join(__dirname, '..', 'config.json');

if (!fs.existsSync(configPath)) {
  logger.log(
    'SETUP',
    'Configuration file not found. Please run "npm run setup" (or "yarn setup") to create it.',
    'ERROR'
  );
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

process.env.VITE_REACT_APP_VERSION = config.version;
process.env.PORT = config.port;
process.env.JWT_SECRET = config.jwtSecret;

logger.log('SETUP', 'Environment variables loaded successfully.', 'INFO');
