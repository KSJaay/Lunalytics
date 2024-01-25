const {
  userExists,
  updateUserAvatar,
} = require('../../../database/queries/user');
const validators = require('../../../utils/validators');

const userUpdateAvatar = async (request, response) => {
  const { access_token } = request.cookies;

  const user = await userExists(access_token);

  const { avatar } = request.body;

  if (!avatar || user.avatar === avatar) {
    return response.sendStatus(200);
  }

  const isInvalidAvatar = validators.user.isAvatar(avatar);

  if (isInvalidAvatar) {
    return response.status(400).send(isInvalidAvatar);
  }

  await updateUserAvatar(user.email, avatar);

  return response.sendStatus(200);
};

module.exports = userUpdateAvatar;
