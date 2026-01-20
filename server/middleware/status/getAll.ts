// import type definitions
import type { Request, Response } from 'express';

// import local files
import { fetchAllStatusPages } from '../../database/queries/status.js';
import { handleError } from '../../utils/errors.js';

const getAllStatusPagesMiddleware = async (
  _request: Request,
  response: Response
) => {
  try {
    const query = await fetchAllStatusPages();

    return response.json(query);
  } catch (error) {
    handleError(error, response);
  }
};

export default getAllStatusPagesMiddleware;
