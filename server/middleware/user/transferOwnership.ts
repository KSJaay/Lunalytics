import {
  emailIsOwner,
  getUserByEmail,
  transferOwnership,
} from '../../database/queries/user.js';
import { handleError } from '../../utils/errors.js';

const transferOwnershipMiddleware = async (request, response) => {
  try {
    const { email } = request.body;

    if (!email) {
      return response.sendStatus(400);
    }

    const { user } = response.locals;

    const userIsOwner = await emailIsOwner(user.email);

    if (!userIsOwner?.isOwner) {
      return response.sendStatus(401);
    }

    const newOwnerExists = await getUserByEmail(email);

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
