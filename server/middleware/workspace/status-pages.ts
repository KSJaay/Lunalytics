// import type definitions
import type { Request, Response } from 'express';

// import local files
import { fetchWorkspaceStatusPages } from '../../database/queries/status.js';
import { handleError } from '../../utils/errors.js';

const getAllStatusPagesMiddleware = async (
  _request: Request,
  response: Response
) => {
  try {
    const query = await fetchWorkspaceStatusPages(response.locals.workspaceId);

    return response.json(query);
  } catch (error) {
    handleError(error, response);
  }
};

export default getAllStatusPagesMiddleware;
