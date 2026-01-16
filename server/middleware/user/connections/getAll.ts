import { fetchConnections } from '../../../database/queries/connection.js';
import { handleError } from '../../../utils/errors.js';

const getAllConnectionMiddleware = async (request, response) => {
  try {
    const connections = await fetchConnections(response.locals.user.email);

    response.status(200).json(connections);
  } catch (error) {
    console.log(error);
    handleError(error, response);
  }
};

export default getAllConnectionMiddleware;
