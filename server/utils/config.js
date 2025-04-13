import fs from 'fs';
import logger from './logger.js';

class Config {
  constructor() {
    this.configPath = `${process.cwd()}/data/config.json`;
    this.config = {};

    if (!fs.existsSync(this.configPath)) {
      return;
    }

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
      logger.notice('CONFIG', {
        message:
          'Configuration file not found. Setup the application by visiting /setup',
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
    return Object.keys(this.config).includes(key) ? this.config[key] : null;
  }
}

const config = new Config();

export default config;
