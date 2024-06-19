import {
  userExists,
  updateUserPermission,
} from '../../../database/queries/user.js';
import { handleError } from '../../../../shared/utils/errors.js';

const permissionUpdateMiddleware = async (request, response) => {
  try {
    const { access_token } = request.cookies;

    if (!access_token) {
      return response.sendStatus(401);
    }

    const user = await userExists(access_token);

    if (!user) {
      return response.sendStatus(401);
    }

    if (user.permission !== 1 && user.permission !== 2) {
      return response.sendStatus(401);
    }

    const { email, permission } = request.body;

    if (!email || !permission) {
      return response.sendStatus(400);
    }

    if (user.permission >= permission) {
      return response
        .status(400)
        .send('You cannot change this user permission.');
    }

    if (![1, 2, 3, 4].includes(permission)) {
      return response.sendStatus(400);
    }

    await updateUserPermission(email, permission);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default permissionUpdateMiddleware;
