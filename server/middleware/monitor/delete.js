// import local files
import cache from '../../cache/index.js';
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';

const monitorDelete = async (request, response) => {
  try {
    const { monitorId } = request.query;

    if (!monitorId) {
      throw new UnprocessableError('No monitorId provided');
    }

    await cache.monitors.delete(monitorId);
    await cache.heartbeats.delete(monitorId);
    await cache.certificates.delete(monitorId);

    return response.sendStatus(200);
  } catch (error) {
    return handleError(error, response);
  }
};

export default monitorDelete;
