import express from 'express';
import {
  fetchStatusPageUsingDomain,
  fetchStatusPageUsingUrl,
} from '../database/queries/status.js';
import { handleError } from '../utils/errors.js';
import { cleanStatusApiResponse, cleanStatusPage } from '../class/status.js';
import statusCache from '../cache/status.js';
import { apiTokenExists } from '../database/queries/tokens.js';
import { getVerifiedSessionUser } from '../utils/session.js';

export const fetchStatusPageUsingIdOrDomain = async (statusPageId, domain) => {
  let statusPage = await fetchStatusPageUsingUrl(statusPageId);

  if (!statusPage && domain) {
    statusPage = await fetchStatusPageUsingDomain(domain);
  }

  return statusPage;
};

const router = express.Router();

router.get('/', async (request, response) => {
  try {
    const { statusPageId } = request.query;

    if (!statusPageId) {
      return response.status(400).json({ message: 'statusPageId is required' });
    }

    const status = await fetchStatusPageUsingIdOrDomain(
      statusPageId,
      request.headers.host
    );

    if (!status) {
      return response.status(404).json({ message: 'status not found' });
    }

    const parsedStatusPage = cleanStatusPage(status);

    if (!parsedStatusPage.settings?.isPublic) {
      const { session_token } = request.cookies;
      const { authorization } = request.headers;

      const user = await getVerifiedSessionUser(session_token);
      const apiToken =
        !user && authorization ? await apiTokenExists(authorization) : null;

      if (!user && !apiToken) {
        return response.sendStatus(401);
      }
    }

    const payload = statusCache.fetchStatusPage(status.statusId);

    return response.json(cleanStatusApiResponse(payload));
  } catch (error) {
    handleError(error, response);
  }
});

export default router;
