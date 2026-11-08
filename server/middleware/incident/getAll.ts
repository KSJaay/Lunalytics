// import type definitions
import type { Request, Response } from 'express';

// import local files
import { handleError } from '../../utils/errors.js';
import { fetchAllIncidents } from '../../database/queries/incident.js';

const getAllIncidents = async (_request: Request, response: Response) => {
  try {
    const incidents = await fetchAllIncidents(response.locals.workspaceId);

    return response.json(incidents);
  } catch (error: any) {
    handleError(error, response);
  }
};

export default getAllIncidents;
