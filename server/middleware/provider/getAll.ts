import { handleError } from '../../utils/errors.js';
import { fetchProviders } from '../../database/queries/provider.js';

const getAllProvidersMiddleware = async (request, response) => {
  try {
    const query = await fetchProviders();

    const providers = query.map((provider) => ({
      ...provider,
      data: provider.data ? JSON.parse(provider.data) : {},
    }));

    return response.json(providers);
  } catch (error) {
    return handleError(error, response);
  }
};

export default getAllProvidersMiddleware;
