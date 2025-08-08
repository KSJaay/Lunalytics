import config from '../../../utils/config.js';
import { handleError } from '../../../utils/errors.js';
import ConfigValidator from '../../../../shared/validators/config.js';

const updateConfigMiddleware = async (request, response) => {
  try {
    const data = ConfigValidator(request.body);

    if (typeof data === 'string') {
      return response.status(400).json({ error: data });
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
