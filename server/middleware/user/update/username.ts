import { updateUserDisplayname } from '../../../database/queries/user.js';
import { handleError } from '../../../utils/errors.js';
import validators from '../../../../shared/validators/index.js';

const userUpdateUsername = async (request, response) => {
  try {
    const { user } = response.locals;
    const { displayName } = request.body;

    if (!displayName || user.displayName === displayName) {
      return response.sendStatus(200);
    }

    const isInvalidUsername = validators.auth.username(displayName);

    if (isInvalidUsername) {
      return response.status(400).send(isInvalidUsername);
    }

    await updateUserDisplayname(user.email, displayName);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default userUpdateUsername;
