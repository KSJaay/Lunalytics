import { handleError } from '../../utils/errors.js';
import { fetchProviders } from '../../database/queries/provider.js';

const getAllProvidersMiddleware = async (request, response) => {
  try {
    const query = await fetchProviders();
    response.json(query);
  } catch (error) {
    console.log(error);
    handleError(error, response);
  }
};

export default getAllProvidersMiddleware;
