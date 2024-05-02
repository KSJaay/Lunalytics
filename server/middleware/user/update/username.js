import {
  updateUserDisplayname,
  userExists,
} from '../../../database/queries/user.js';
import validators from '../../../utils/validators/index.js';

const userUpdateUsername = async (request, response) => {
  const { access_token } = request.cookies;

  const user = await userExists(access_token);

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
};

export default userUpdateUsername;
