import cache from '../../cache/monitor/index.js';
import statusCache from '../../cache/status.js';
import { pauseMonitor } from '../../database/queries/monitor.js';
import { handleError } from '../../utils/errors.js';
import { MONITOR_ERRORS } from '../../../shared/constants/errors/monitor.js';

const isTruthy = (value) => value == true || value == 'true';
const isFalsy = (value) => value == false || value == 'false';

const monitorPause = async (request, response) => {
  try {
    const { monitorId, pause } = request.body;

    if (!monitorId) {
      return response.status(400).json(MONITOR_ERRORS.M004);
    }

    if (!isTruthy(pause) && !isFalsy(pause)) {
      return response
        .status(400)
        .json({
          ...MONITOR_ERRORS.M003,
          details: 'Pause should be a boolean value',
        });
    }

    await pauseMonitor(monitorId, response.locals.workspaceId, isTruthy(pause));

    if (isTruthy(pause)) {
      cache.removeMonitor(monitorId, response.locals.workspaceId);
    } else {
      await cache.checkMonitorStatus(monitorId, response.locals.workspaceId);
    }

    statusCache
      .reloadMonitor(monitorId, response.locals.workspaceId)
      .catch(() => false);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default monitorPause;
