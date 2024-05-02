import {
  userExists,
  updateUserAvatar,
} from '../../../database/queries/user.js';
import validators from '../../../utils/validators/index.js';

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

export default userUpdateAvatar;
