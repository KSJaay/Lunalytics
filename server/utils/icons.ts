import axios from 'axios';
import logger from './logger.js';
import { loadJSON } from '../../shared/parseJson.js';

interface Icon {
  n: string;
  u: string;
  id: string;
}

let icons: { [key: string]: Icon[] | [] } = {
  'selfh.st': [],
  custom: [],
};
let lastFetched: number = 0;

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

    if (query?.data && Array.isArray(query.data)) {
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
        const uniqueCustomIcons = formattedCustomIcons
          .filter((icon) => !existingNames.has(icon?.n))
          .filter((item) => item !== null) as Icon[];

        icons['custom'] = uniqueCustomIcons || [];
      }

      logger.info('Icons have been loaded successfully!');

      lastFetched = Date.now();
    }
  } catch (error: any) {
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
