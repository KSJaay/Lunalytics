import axios from 'axios';
import logger from './logger.js';
import { loadJSON } from '../../shared/parseJson.js';

let icons = {
  'selfh.st': [],
  custom: [],
};
let lastFetched;

export const loadIcons = async () => {
  try {
    let query = await axios
      .get('https://lunalytics.xyz/api/v1/icons')
      .catch(() => null);

    if (!query || !query?.data?.length || query?.data?.length < 1) {
      query = await axios
        .get('https://lunalytics.xyz/backup-icons.json')
        .catch(() => null);
    }

    if (query.data && Array.isArray(query.data)) {
      if (query.data?.length) {
        icons['selfh.st'] = query.data;
      }

      const customIcons = loadJSON('data/icons.json');

      if (Array.isArray(customIcons)) {
        const formattedCustomIcons = customIcons
          .map(({ id, name, url }) => {
            if (!name || !url || !id) return null;
            return { n: name, u: url, id };
          })
          .filter(Boolean);

        const existingNames = new Set(icons['selfh.st'].map((icon) => icon.n));
        const uniqueCustomIcons = formattedCustomIcons.filter(
          (icon) => !existingNames.has(icon.n)
        );

        icons['custom'] = uniqueCustomIcons;
      }

      logger.info('Icons have been loaded successfully!');

      lastFetched = Date.now();
    }
  } catch (error) {
    logger.error('Error loading icons', {
      error: error.message,
      stack: error.stack,
    });
  }
};

export const getIcons = () => ({
  icons,
  lastFetched,
});
