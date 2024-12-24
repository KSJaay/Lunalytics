import cache from '../../cache/index.js';
import { pauseMonitor } from '../../database/queries/monitor.js';
import { handleError } from '../../utils/errors.js';

const isTruthy = (value) => value == true || value == 'true';
const isFalsy = (value) => value == false || value == 'false';

const monitorPause = async (request, response) => {
  try {
    const { monitorId, pause } = request.body;

    if (!monitorId) {
      throw new Error('No monitorId provided');
    }

    if (!isTruthy(pause) && !isFalsy(pause)) {
      throw new Error('Pause should be a boolean value');
    }

    await pauseMonitor(monitorId, isTruthy(pause));

    if (isTruthy(pause)) {
      cache.removeMonitor(monitorId);
    } else {
      await cache.checkStatus(monitorId);
    }

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default monitorPause;
