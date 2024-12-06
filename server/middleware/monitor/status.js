import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
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
      throw new UnprocessableError('Monitor ID is required');
    }

    if (!validTypes.includes(type)) {
      throw new UnprocessableError('Invalid type');
    }

    const monitorExists = await fetchMonitor(monitorId);

    if (!monitorExists) {
      return response.status(404).json({
        message: 'Monitor not found',
      });
    }

    let heartbeats = [];

    if (type === 'latest') {
      heartbeats = await fetchHeartbeats(monitorId);
    }
    if (type === 'day') {
      heartbeats = await fetchDailyHeartbeats(monitorId);
    }

    if (type === 'week') {
      heartbeats = await fetchHourlyHeartbeats(monitorId, 168);
    }

    if (type === 'month') {
      heartbeats = await fetchHourlyHeartbeats(monitorId, 720);
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
