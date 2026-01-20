// import type definitions
import type { Request, Response } from 'express';

// import local files
import { getAllApiTokens } from '../../database/queries/tokens.js';
import { handleError } from '../../utils/errors.js';

const getAllApiTokensMiddleware = async (
  _request: Request,
  response: Response
) => {
  try {
    const tokens = await getAllApiTokens(response.locals.workspaceId);

    return response.status(200).json({ tokens });
  } catch (error) {
    handleError(error, response);
  }
};

export default getAllApiTokensMiddleware;
