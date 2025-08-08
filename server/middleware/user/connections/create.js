import { createConnection } from '../../../database/queries/connection.js';
import { handleError } from '../../../utils/errors.js';

const createConnectionMiddleware = async (request, response) => {
  const data = request.body;

  try {
    await createConnection(response.locals.user.email, data);
  } catch (error) {
    console.log(error);
    handleError(error, response);
  }
};

export default createConnectionMiddleware;
