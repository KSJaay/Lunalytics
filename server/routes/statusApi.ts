// import type definitions
import type { Request, Response } from 'express';

// import node modules
import express from 'express';

// import local files
import {
  fetchStatusPageUsingDomain,
  fetchStatusPageUsingUrl,
} from '../database/queries/status.js';
import { handleError } from '../utils/errors.js';
import { cleanStatusApiResponse, cleanStatusPage } from '../class/status.js';
import statusCache from '../cache/status.js';
import { userSessionExists } from '../database/queries/session.js';
import { getUserByEmail } from '../database/queries/user.js';
import { apiTokenExists } from '../database/queries/tokens.js';

export const fetchStatusPageUsingIdOrDomain = async (
  statusPageId: string,
  domain?: string
) => {
  let statusPage = await fetchStatusPageUsingUrl(statusPageId);

  if (!statusPage && domain) {
    statusPage = await fetchStatusPageUsingDomain(domain);
  }

  return statusPage;
};

const router = express.Router();

router.get('/', async (request: Request, response: Response) => {
  try {
    const { statusPageId } = request.query;

    if (!statusPageId || typeof statusPageId !== 'string') {
      return response.status(400).json({ message: 'statusPageId is required' });
    }

    const status = await fetchStatusPageUsingIdOrDomain(
      statusPageId,
      request.headers.host as string
    );

    if (!status) {
      return response.status(404).json({ message: 'status not found' });
    }

    const parsedStatusPage = cleanStatusPage(status);

    if (!parsedStatusPage.settings?.isPublic) {
      const { session_token } = request.cookies;
      const { authorization } = request.headers;

      if (!session_token && !authorization) {
        return response.sendStatus(401);
      }

      if (session_token) {
        const session = await userSessionExists(session_token);
        const user = await getUserByEmail(session.email);

        if (!user) {
          return response.sendStatus(401);
        }
      }

      if (authorization) {
        const token = await apiTokenExists(authorization);
        const user = await getUserByEmail(token.email);

        if (!user) {
          return response.sendStatus(401);
        }
      }
    }

    const payload = statusCache.fetchStatusPage(
      status.statusId,
      status.workspaceId
    );

    return response.json(cleanStatusApiResponse(payload));
  } catch (error) {
    handleError(error, response);
  }
});

export default router;
