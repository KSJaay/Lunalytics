import express from 'express';
import { fetchStatusPageUsingUrl } from '../database/queries/status.js';
import { handleError } from '../utils/errors.js';
import { cleanStatusApiResponse } from '../class/status.js';
import statusCache from '../cache/status.js';

const router = express.Router();

router.get('/', async (request, response) => {
  try {
    const { statusPageId } = request.query;

    if (!statusPageId) {
      return response.status(400).json({ message: 'statusPageId is required' });
    }

    const status = await fetchStatusPageUsingUrl(statusPageId);

    if (!status) {
      return response.status(404).json({ message: 'status not found' });
    }

    const payload = statusCache.fetchStatusPage(status.statusId);

    return response.json(cleanStatusApiResponse(payload));
  } catch (error) {
    handleError(error, response);
  }
});

export default router;
