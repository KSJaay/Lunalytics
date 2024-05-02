import { existsSync, readFileSync } from 'fs';
import path from 'path';
import logger from '../server/utils/logger.js';

const configPath = path.join(process.cwd(),  'config.json');

if (!existsSync(configPath)) {
  logger.log(
    'SETUP',
    'Configuration file not found. Please run "npm run setup" (or "yarn setup") to create it.',
    'ERROR'
  );
  process.exit(1);
}

const config = JSON.parse(readFileSync(configPath, 'utf-8'));

process.env.VITE_REACT_APP_VERSION = config.version;
process.env.PORT = config.port;
process.env.JWT_SECRET = config.jwtSecret;

logger.log('SETUP', 'Environment variables loaded successfully.', 'INFO');
