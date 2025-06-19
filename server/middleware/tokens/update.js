import TokenValidator from '../../../shared/validators/token.js';
import { apiTokenUpdate } from '../../database/queries/tokens.js';
import { handleError } from '../../utils/errors.js';

const updateApiTokenMiddleware = async (request, response) => {
  const { token, name, permission } = request.body;

  try {
    const isInvalid = TokenValidator({
      name,
      token,
      permission,
      isEdit: true,
    });

    if (isInvalid) {
      return response.status(400).send({
        message: isInvalid,
      });
    }

    const query = await apiTokenUpdate(token, name, permission);

    return response.status(200).send(query);
  } catch (error) {
    handleError(error, response);
  }
};

export default updateApiTokenMiddleware;
