import fs from 'fs';
import logger from './logger.js';

class Config {
  constructor() {
    this.configPath = `${process.cwd()}/data/config.json`;
    this.config = {};

    try {
      fs.watch(this.configPath, { persistent: false }, (eventType) => {
        if (eventType === 'change') {
          this.readConfigFile();
        }
      });
    } catch (error) {
      logger.error('CONFIG', {
        message: error?.message,
        stack: error?.stack,
      });
    }

    logger.info('CONFIG', { message: 'Loading configuration...' });

    this.readConfigFile();
  }

  readConfigFile() {
    if (!fs.existsSync(this.configPath)) {
      logger.error('CONFIG', {
        message:
          'Configuration file not found. Please run "npm run setup" (or "yarn setup" or "pnpm setup") to create it.',
      });
      return;
    }

    const fileData = fs.readFileSync(this.configPath);

    try {
      this.config = JSON.parse(fileData);
      process.env.VITE_API_URL = this.config.websiteUrl;

      if (process.env.NODE_ENV === 'test') {
        if (!this.config.database) this.config.database = {};
        this.config.database.name = 'e2etest';

        logger.info('CONFIG', {
          message: 'Changed database name to "e2etest" for testing purposes.',
        });
      }

      logger.info('CONFIG', {
        message: 'Configuration has been setup successfully.',
      });
    } catch (jsonError) {
      logger.error(`CONFIG`, {
        message: 'Unable to parse config file JSON',
        jsonError,
      });
    }
  }

  get(key) {
    const value = this.config[key];
    return value;
  }
}

const config = new Config();

export default config;
