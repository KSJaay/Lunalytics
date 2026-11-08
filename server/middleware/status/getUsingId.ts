// import type definitions
import type { Request, Response } from 'express';

// import local files
import { cleanStatusPage } from '../../class/status.js';
import { fetchStatusPageUsingUrl } from '../../database/queries/status.js';
import { handleError } from '../../utils/errors.js';

const getUsingIdMiddleware = async (request: Request, response: Response) => {
  try {
    const { statusPageId } = request.query;

    if (!statusPageId) {
      return response.sendStatus(404);
    }

    const query = await fetchStatusPageUsingUrl(statusPageId as string);

    if (!query) {
      return response.sendStatus(404);
    }

    return response.json(cleanStatusPage(query));
  } catch (error) {
    handleError(error, response);
  }
};

export default getUsingIdMiddleware;
