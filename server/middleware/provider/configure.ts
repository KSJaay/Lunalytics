import { handleError } from '../../utils/errors.js';
import {
  createProvider,
  fetchProvider,
  updateProvider,
} from '../../database/queries/provider.js';
import ProviderValidator from '../../../shared/validators/provider.js';

const configureProviderMiddleware = async (request, response) => {
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

    const providerObj = {
      email: response.locals.user.email,
      clientId,
      clientSecret,
      provider,
      enabled,
      data: JSON.stringify(data),
    };

    if (providerExists) {
      await updateProvider(provider, providerObj);
    } else {
      await createProvider(providerObj);
    }

    return response.status(200).json(providerObj);
  } catch (error) {
    handleError(error, response);
  }
};

export default configureProviderMiddleware;
