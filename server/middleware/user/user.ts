// import type definitions
import type { Request, Response } from 'express';

// import local files
import { handleError } from '../../utils/errors.js';

const fetchUserMiddleware = async (_request: Request, response: Response) => {
  try {
    const { user } = response.locals;

    return response.send(user);
  } catch (error) {
    handleError(error, response);
  }
};

export default fetchUserMiddleware;
