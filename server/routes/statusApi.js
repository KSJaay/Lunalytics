import express from 'express';
import { fetchStatusPageUsingUrl } from '../database/queries/status.js';
import { handleError } from '../utils/errors.js';
import { cleanStatusApiResponse, cleanStatusPage } from '../class/status.js';
import statusCache from '../cache/status.js';
import { userSessionExists } from '../database/queries/session.js';
import { getUserByEmail } from '../database/queries/user.js';

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

    const parsedStatusPage = cleanStatusPage(status);

    if (!parsedStatusPage.settings?.isPublic) {
      const { session_token } = request.cookies;
      const { Authorization } = request.headers;

      if (!session_token && !Authorization) {
        return response.sendStatus(401);
      }

      if (session_token) {
        const session = await userSessionExists(session_token);
        const user = await getUserByEmail(session.email);

        if (!user) {
          return response.sendStatus(401);
        }
      }

      if (Authorization) {
        const session = await userSessionExists(session_token);
        const user = await getUserByEmail(session.email);

        if (!user) {
          return response.sendStatus(401);
        }
      }
    }

    const payload = statusCache.fetchStatusPage(status.statusId);

    return response.json(cleanStatusApiResponse(payload));
  } catch (error) {
    handleError(error, response);
  }
});

export default router;
