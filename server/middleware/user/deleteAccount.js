import { userExists, declineAccess } from '../../database/queries/user.js';
import { handleError } from '../../utils/errors.js';

const deleteAccountMiddleware = async (request, response) => {
  try {
    const { access_token } = request.cookies;

    if (!access_token) {
      return response.sendStatus(401);
    }

    const user = await userExists(access_token);

    if (!user) {
      return response.sendStatus(401);
    }

    if (user.permission === 1) {
      return response
        .status(403)
        .send('Please transfer ownership before deleting your account.');
    }

    await declineAccess(user.email);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default deleteAccountMiddleware;
