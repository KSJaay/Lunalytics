import { approveAccess } from '../../../database/queries/user.js';
import { handleError } from '../../../utils/errors.js';

const accessApproveMiddleware = async (request, response) => {
  try {
    const { email } = request.body;

    if (!email) {
      return response.sendStatus(400);
    }

    await approveAccess(email);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default accessApproveMiddleware;
