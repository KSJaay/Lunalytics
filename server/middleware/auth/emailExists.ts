import { getUserByEmail } from '../../database/queries/user.js';
import { handleError } from '../../utils/errors.js';

const emailExistsMiddleware = async (request, response) => {
  try {
    const { email } = request.body;
    if (!email) return response.status(400).send('No email provided');

    const user = await getUserByEmail(email);
    if (!user) return response.sendStatus(404);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default emailExistsMiddleware;
