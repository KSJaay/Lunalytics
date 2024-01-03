const cache = require('../../cache');
const { handleError } = require('../../utils/errors');

const fetchMonitorUsingId = async (request, response) => {
  try {
    const { monitorId } = request.query;

    if (!monitorId) {
      return response.status(400).json({ error: 'No monitorId provided' });
    }

    const monitor = await cache.monitor.getMonitor(monitorId);

    return response.json(monitor);
  } catch (error) {
    console.log(error);
    handleError(error, response);
  }
};

module.exports = fetchMonitorUsingId;
