// import type definitions
import type { Request, Response } from 'express';

// import local files
import { handleError } from '../../utils/errors.js';
import { getUserByEmail } from '../../database/queries/user.js';

const userExistsMiddleware = async (request: Request, response: Response) => {
  try {
    const { email } = request.body;
    if (!email) return response.status(400).send('No email provided');

    const user = await getUserByEmail(email);
    if (!user) return response.send(false);

    return response.send(true);
  } catch (error) {
    handleError(error, response);
  }
};

export default userExistsMiddleware;
