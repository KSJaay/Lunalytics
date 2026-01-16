import { fetchAllStatusPages } from '../../database/queries/status.js';
import { handleError } from '../../utils/errors.js';

const getAllStatusPagesMiddleware = async (request, response) => {
  try {
    const query = await fetchAllStatusPages();

    return response.json(query);
  } catch (error) {
    handleError(error, response);
  }
};

export default getAllStatusPagesMiddleware;
