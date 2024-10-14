import { existsSync, readFileSync } from 'fs';
import path from 'path';
import logger from '../server/utils/logger.js';

const configPath = path.join(process.cwd(), 'config.json');

if (!existsSync(configPath)) {
  logger.info('SETUP', {
    message:
      'Configuration file not found. Please run "npm run setup" (or "yarn setup") to create it.',
  });
  process.exit(1);
}

const config = JSON.parse(readFileSync(configPath, 'utf-8'));

process.env.PORT = config.port;
process.env.JWT_SECRET = config.jwtSecret;
process.env.IS_DEMO = config.isDemo ? 'enabled' : 'disabled';
process.env.DATABASE_NAME = config.database?.name;
process.env.CORS_LIST = config.cors;

if (process.env.NODE_ENV === 'test') {
  process.env.DATABASE_NAME = 'e2e-test';

  logger.info('SETUP', {
    message: 'Changed database name to "e2e-test" for testing purposes.',
  });
}

logger.info('SETUP', { message: 'Environment variables loaded successfully.' });
