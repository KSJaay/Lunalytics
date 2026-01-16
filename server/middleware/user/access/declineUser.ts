import { declineAccess } from '../../../database/queries/user.js';
import { handleError } from '../../../utils/errors.js';

const accessDeclineMiddleware = async (request, response) => {
  try {
    const { email } = request.body;

    if (!email) {
      return response.sendStatus(400);
    }

    await declineAccess(email);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default accessDeclineMiddleware;
