import { handleError } from '../../utils/errors.js';
import {
  fetchProvider,
  updateProvider,
} from '../../database/queries/provider.js';
import ProviderValidator from '../../../shared/validators/provider.js';

const updateProviderMiddleware = async (request, response) => {
  const {
    clientId,
    clientSecret,
    provider,
    enabled = true,
    data = {},
  } = request.body;

  try {
    const isInvalid = ProviderValidator({
      clientId,
      clientSecret,
      provider,
      enabled,
      data,
    });

    if (isInvalid) {
      return response.status(400).json({ error: isInvalid });
    }

    const providerExists = await fetchProvider(provider);

    if (!providerExists) {
      return response.status(400).json({
        error: 'Unable to find configuration for this provider',
      });
    }

    await updateProvider(provider, {
      clientId,
      clientSecret,
      provider,
      enabled,
      data,
    });

    return response.sendStatus(200);
  } catch (error) {
    console.log(error);
    handleError(error, response);
  }
};

export default updateProviderMiddleware;
