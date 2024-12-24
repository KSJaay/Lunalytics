import { emailExists } from '../../database/queries/user.js';
import { handleError } from '../../utils/errors.js';

const userExistsMiddleware = async (request, response) => {
  try {
    const { email } = request.body;
    if (!email) return response.status(400).send('No email provided');

    const user = await emailExists(email);
    if (!user) return response.send(false);

    return response.send(true);
  } catch (error) {
    handleError(error, response);
  }
};

export default userExistsMiddleware;
