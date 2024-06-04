import {
  updateUserPassword,
  userExists,
} from '../../../database/queries/user.js';
import { handleError } from '../../../utils/errors.js';
import { verifyPassword } from '../../../utils/hashPassword.js';
import validators from '../../../utils/validators/index.js';

const userUpdatePassword = async (request, response) => {
  try {
    const { access_token } = request.cookies;

    if (!access_token) {
      return response.sendStatus(401);
    }

    const user = await userExists(access_token);

    if (!user) {
      return response.sendStatus(401);
    }

    const { currentPassword, newPassword } = request.body;

    const passwordMatches = verifyPassword(currentPassword, user.password);

    if (!passwordMatches) {
      return response.status(401).json({
        current: 'Password does not match your current password',
      });
    }

    const isInvalidPassword = validators.auth.password(newPassword);

    if (isInvalidPassword) {
      return response.status(400).send(isInvalidPassword);
    }

    await updateUserPassword(user.email, newPassword);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default userUpdatePassword;
