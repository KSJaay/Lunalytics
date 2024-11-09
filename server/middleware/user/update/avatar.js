import {
  userExists,
  updateUserAvatar,
} from '../../../database/queries/user.js';
import { handleError } from '../../../utils/errors.js';
import validators from '../../../../shared/validators/index.js';

const userUpdateAvatar = async (request, response) => {
  try {
    const { access_token } = request.cookies;

    if (!access_token) {
      return response.sendStatus(401);
    }

    const user = await userExists(access_token);

    if (!user) {
      return response.sendStatus(401);
    }

    const { avatar } = request.body;

    if (avatar !== null && (!avatar || user.avatar === avatar)) {
      return response.sendStatus(200);
    }

    const isInvalidAvatar = validators.user.isAvatar(avatar);

    if (isInvalidAvatar) {
      return response.status(400).send(isInvalidAvatar);
    }

    await updateUserAvatar(user.email, avatar);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default userUpdateAvatar;
