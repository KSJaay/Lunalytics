// import type definitions
import type { Request, Response } from 'express';

// import local files
import { createConnection } from '../../../database/queries/connection.js';
import { handleError } from '../../../utils/errors.js';

const createConnectionMiddleware = async (
  request: Request,
  response: Response
) => {
  const data = request.body;

  try {
    await createConnection(response.locals.user.email, data);
  } catch (error) {
    handleError(error, response);
  }
};

export default createConnectionMiddleware;
