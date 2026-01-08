import TokenValidator from '../../../shared/validators/token.js';
import { apiTokenCreate } from '../../database/queries/tokens.js';
import { handleError } from '../../utils/errors.js';

const createApiTokenMiddleware = async (request, response) => {
  const { permission, name } = request.body;

  try {
    const isInvalid = TokenValidator({
      name,
      permission,
    });

    if (isInvalid) {
      return response.status(400).send({
        message: isInvalid,
      });
    }

    const {
      user: { email },
    } = response.locals;

    const query = await apiTokenCreate(
      email,
      permission,
      name,
      response.locals.user.workspaceId
    );

    return response.status(200).send(query);
  } catch (error) {
    handleError(error, response);
  }
};

export default createApiTokenMiddleware;
