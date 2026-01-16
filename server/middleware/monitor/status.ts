import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import { MONITOR_ERRORS } from '../../../shared/constants/errors/monitor.js';
import { fetchMonitor } from '../../database/queries/monitor.js';
import {
  fetchDailyHeartbeats,
  fetchHeartbeats,
  fetchHourlyHeartbeats,
} from '../../database/queries/heartbeat.js';
const validTypes = ['latest', 'day', 'week', 'month'];

const fetchMonitorStatus = async (request, response) => {
  try {
    const { monitorId, type = 'latest' } = request.query;

    if (!monitorId) {
      return response.status(400).json(MONITOR_ERRORS.M004);
    }

    if (!validTypes.includes(type)) {
      return response
        .status(400)
        .json({ ...MONITOR_ERRORS.M003, details: 'Invalid type' });
    }

    const monitorExists = await fetchMonitor(
      monitorId,
      response.locals.workspaceId
    );

    if (!monitorExists) {
      return response.status(404).json(MONITOR_ERRORS.M001);
    }

    let heartbeats = [];

    if (type === 'latest') {
      heartbeats = await fetchHeartbeats(
        monitorId,
        response.locals.workspaceId
      );
    }
    if (type === 'day') {
      heartbeats = await fetchDailyHeartbeats(
        monitorId,
        response.locals.workspaceId
      );
    }

    if (type === 'week') {
      heartbeats = await fetchHourlyHeartbeats(
        monitorId,
        response.locals.workspaceId,
        168
      );
    }

    if (type === 'month') {
      heartbeats = await fetchHourlyHeartbeats(
        monitorId,
        response.locals.workspaceId,
        720
      );
    }

    if (type !== 'latest' && heartbeats.length < 2) {
      return response.sendStatus(416);
    }

    return response.json(heartbeats);
  } catch (error) {
    return handleError(error, response);
  }
};

export default fetchMonitorStatus;
