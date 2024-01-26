const {
  updateUserDisplayname,
  userExists,
} = require('../../../database/queries/user');
const validators = require('../../../utils/validators');

const userUpdateUsername = async (request, response) => {
  const { access_token } = request.cookies;

  const user = await userExists(access_token);

  const { displayName } = request.body;

  if (!displayName || user.displayName === displayName) {
    return response.sendStatus(200);
  }

  const isInvalidUsername = validators.user.isUsername(displayName);

  if (isInvalidUsername) {
    return response.status(400).send(isInvalidUsername);
  }

  await updateUserDisplayname(user.email, displayName);

  return response.sendStatus(200);
};

module.exports = userUpdateUsername;
