import cache from '../../cache/index.js';
import {
  UnprocessableError,
  handleError,
} from '../../../shared/utils/errors.js';
const validTypes = ['latest', 'day', 'week', 'month'];

const fetchMonitorStatus = async (request, response) => {
  try {
    const { monitorId, type } = request.query;

    if (!monitorId) {
      throw new UnprocessableError('Monitor ID is required');
    }

    if (!validTypes.includes(type)) {
      throw new UnprocessableError('Invalid type');
    }

    const monitorExists = await cache.monitors.get(monitorId);

    if (!monitorExists) {
      return response.status(404).json({
        message: 'Monitor not found',
      });
    }

    if (type === 'latest') {
      const heartbeats = cache.heartbeats.getRealtime(monitorId);

      return response.json(heartbeats);
    }

    if (type === 'day') {
      const heartbeats = cache.heartbeats.getDaily(monitorId);

      if (heartbeats.length < 2) {
        return response.sendStatus(416);
      }

      return response.json(heartbeats);
    }

    if (type === 'week') {
      const heartbeats = cache.heartbeats.getWeekly(monitorId);

      if (heartbeats.length < 2) {
        return response.sendStatus(416);
      }

      return response.json(heartbeats);
    }

    if (type === 'month') {
      const heartbeats = cache.heartbeats.getMonthly(monitorId);

      if (heartbeats.length < 2) {
        return response.sendStatus(416);
      }

      return response.json(heartbeats);
    }

    return response.sendStatus(404);
  } catch (error) {
    return handleError(error, response);
  }
};

export default fetchMonitorStatus;
