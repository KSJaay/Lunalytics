import config from '../../../utils/config.js';
import { handleError } from '../../../utils/errors.js';
import ConfigValidator from '../../../../shared/validators/config.js';
import { fetchProviders } from '../../../database/queries/provider.js';

const updateConfigMiddleware = async (request, response) => {
  try {
    const data = ConfigValidator(request.body);

    if (typeof data === 'string') {
      return response.status(400).json({ error: data });
    }

    if (
      typeof data.nativeSignin !== 'undefined' &&
      data.nativeSignin === false
    ) {
      const query = await fetchProviders();
      const isSsoEnabled = query.some((provider) => provider.enabled);

      if (!isSsoEnabled) {
        return response.status(400).json({
          error:
            'SSO is not enabled, please enable that before turning off native signin',
        });
      }
    }

    for (const [key, value] of Object.entries(data)) {
      config.set(key, value);
    }

    return response.json({ success: true });
  } catch (error) {
    return handleError(error, response);
  }
};

export default updateConfigMiddleware;
