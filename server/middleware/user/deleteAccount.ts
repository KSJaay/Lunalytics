import { declineAccess, emailIsOwner } from '../../database/queries/user.js';
import { handleError } from '../../utils/errors.js';

const deleteAccountMiddleware = async (request, response) => {
  try {
    const { user } = response.locals;

    const userIsOwner = await emailIsOwner(user.email);

    if (userIsOwner.permission === 1) {
      return response
        .status(403)
        .send('Please transfer ownership before deleting your account.');
    }

    await declineAccess(user.email);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default deleteAccountMiddleware;
