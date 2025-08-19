import { getIcons, loadIcons } from '../utils/icons.js';

const fetchIcons = async (request, response) => {
  const { lastFetched, icons } = getIcons();

  if (lastFetched + 21600000 < Date.now()) {
    loadIcons();
  }

  return response.status(200).json(icons);
};

export default fetchIcons;
