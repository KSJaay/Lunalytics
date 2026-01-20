// import type definitions
import type { Request, Response } from 'express';

// import local files
import { getIcons, loadIcons } from '../utils/icons.js';

const fetchIcons = async (_request: Request, response: Response) => {
  const { lastFetched, icons } = getIcons();

  if (lastFetched + 21600000 < Date.now()) {
    loadIcons();
  }

  return response.status(200).json(icons);
};

export default fetchIcons;
