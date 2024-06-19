import {
  emailExists,
  transferOwnership,
  userExists,
} from '../../database/queries/user.js';
import { handleError } from '../../../shared/utils/errors.js';

const transferOwnershipMiddleware = async (request, response) => {
  try {
    const {
      cookies: { access_token },
      body: { email },
    } = request;

    if (!access_token) {
      return response.sendStatus(401);
    }

    if (!email) {
      return response.sendStatus(400);
    }

    const user = await userExists(access_token);

    if (!user) {
      return response.sendStatus(401);
    }

    if (user.permission !== 1) {
      return response.sendStatus(401);
    }

    const newOwnerExists = await emailExists(email);

    if (!newOwnerExists) {
      return response.sendStatus(400);
    }

    await transferOwnership(user.email, email);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default transferOwnershipMiddleware;
