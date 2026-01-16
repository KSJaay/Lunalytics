import {
  getUserPasswordUsingEmail,
  updateUserPassword,
} from '../../../database/queries/user.js';
import { handleError } from '../../../utils/errors.js';
import { verifyPassword } from '../../../utils/hashPassword.js';
import validators from '../../../../shared/validators/index.js';

const userUpdatePassword = async (request, response) => {
  try {
    const { user } = response.locals;

    const password = await getUserPasswordUsingEmail(user.email);

    const { currentPassword, newPassword } = request.body;

    const passwordMatches = verifyPassword(currentPassword, password);

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
