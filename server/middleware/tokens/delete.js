import { apiTokenDelete } from '../../database/queries/tokens.js';
import { handleError } from '../../utils/errors.js';

const deleteApiTokenMiddleware = async (request, response) => {
  const { token } = request.body;

  try {
    if (!token) {
      return response.status(400).send({
        message: 'Token is required',
      });
    }

    await apiTokenDelete(token, response.locals.user.workspaceId);

    return response.status(200).send({
      message: 'Token deleted successfully',
    });
  } catch (error) {
    handleError(error, response);
  }
};

export default deleteApiTokenMiddleware;
