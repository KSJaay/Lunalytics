import { handleError } from '../../utils/errors.js';

const fetchUserMiddleware = async (request, response) => {
  try {
    const { user } = response.locals;

    return response.send(user);
  } catch (error) {
    handleError(error, response);
  }
};

export default fetchUserMiddleware;
