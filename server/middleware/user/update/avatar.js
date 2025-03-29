import { updateUserAvatar } from '../../../database/queries/user.js';
import { handleError } from '../../../utils/errors.js';
import validators from '../../../../shared/validators/index.js';

const userUpdateAvatar = async (request, response) => {
  try {
    const { user } = response.locals;

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
