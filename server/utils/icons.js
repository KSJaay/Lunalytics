import axios from 'axios';
import logger from './logger.js';

let icons = [];
let lastFetched;

export const loadIcons = async () => {
  try {
    const query = await axios.get(
      'https://raw.githubusercontent.com/selfhst/cdn/refs/heads/main/directory/icons.json'
    );

    if (query.data && Array.isArray(query.data)) {
      const formattedIcons = query.data
        .map(({ Name, Reference, SVG, PNG, WebP }) => {
          let format;

          if (SVG === 'Yes') {
            format = 'svg';
          } else if (PNG === 'Yes') {
            format = 'png';
          } else if (WebP === 'Yes') {
            format = 'webp';
          }

          if (!format) return null;

          return { n: Name, u: Reference, f: format };
        })
        .filter(Boolean);

      if (formattedIcons.length) {
        icons = formattedIcons;
      }

      logger.info('Icons have been loaded successfully!');

      lastFetched = Date.now();
    }
  } catch (error) {
    logger.error('Error loading icons', { error: error.message });
  }
};

export const getIcons = () => ({
  icons,
  lastFetched,
});
