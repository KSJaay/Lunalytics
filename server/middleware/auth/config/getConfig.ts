import config from '../../../utils/config.js';
import { handleError } from '../../../utils/errors.js';
import { fetchProviders } from '../../../database/queries/provider.js';

const getConfigMiddleware = async (request, response) => {
  try {
    const query = await fetchProviders();

    const providers = query.map(({ provider }) => provider);
    const isSsoEnabled = query?.length > 0 && query?.some((p) => p.enabled);
    const nativeSignin = !isSsoEnabled
      ? true
      : config.get('nativeSignin') ?? true;
    const register = config.get('register') ?? true;

    return response.json({
      nativeSignin,
      register,
      sso: isSsoEnabled,
      providers,
    });
  } catch (error) {
    return handleError(error, response);
  }
};

export default getConfigMiddleware;
