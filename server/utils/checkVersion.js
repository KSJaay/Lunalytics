import axios from 'axios';
import { compare } from 'compare-versions';
import logger from './logger.js';

const oneHourInMs = 1000 * 60 * 60;

let version = {
  current: process.env.npm_package_version,
  latest: null,
  updateAvailable: false,
};

export const startVersionCheck = () => {
  let check = async () => {
    logger.info('Fetching the latest version');

    try {
      const res = await axios.get('https://lunalytics.xyz/api/v1/version');

      version = {
        current: process.env.npm_package_version,
        latest: res.data.latest,
        updateAvailable: compare(
          res.data.latest,
          process.env.npm_package_version,
          '>'
        ),
      };
    } catch (error) {
      logger.error('Failed to check for new versions', {
        message: error.message,
        stack: error.stack,
      });
    }
  };

  check();
  setInterval(check, oneHourInMs);
};

export const getVersionInfo = () => version;
