import { handleError } from '../../utils/errors.js';
import { deleteProvider } from '../../database/queries/provider.js';

const deleteProviderMiddleware = async (request, response) => {
  const { provider } = request.body;

  try {
    await deleteProvider(provider);
  } catch (error) {
    handleError(error, response);
  }
};

export default deleteProviderMiddleware;
