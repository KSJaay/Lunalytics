// import type definitions
import type { Request, Response } from 'express';

// import local files
import { declineAccess } from '../../../database/queries/user.js';
import { handleError } from '../../../utils/errors.js';

const accessRemoveMiddleware = async (request: Request, response: Response) => {
  try {
    const { email } = request.body;

    if (!email) {
      return response.sendStatus(400);
    }

    await declineAccess(email);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default accessRemoveMiddleware;
