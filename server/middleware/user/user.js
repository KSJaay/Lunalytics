import { userExists } from '../../database/queries/user.js';
import { handleError } from '../../utils/errors.js';

const fetchUserMiddleware = async (request, response) => {
  try {
    const { access_token } = request.cookies;

    const user = await userExists(access_token);

    user.canEdit = [1, 2, 3].includes(user.permission);
    user.canManage = [1, 2].includes(user.permission);

    return response.send(user);
  } catch (error) {
    handleError(error, response);
  }
};

export default fetchUserMiddleware;
