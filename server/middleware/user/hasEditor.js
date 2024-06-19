import { userExists } from '../../database/queries/user.js';
import { handleError } from '../../../shared/utils/errors.js';

const hasEditorPermissions = async (request, response, next) => {
  try {
    const { access_token } = request.cookies;

    if (!access_token) {
      return response.sendStatus(401);
    }

    const user = await userExists(access_token);

    if (!user) {
      return response.sendStatus(401);
    }

    if (
      user.permission !== 1 &&
      user.permission !== 2 &&
      user.permission !== 3
    ) {
      return response.sendStatus(401);
    }

    return next();
  } catch (error) {
    handleError(error, response);
  }
};

export default hasEditorPermissions;
