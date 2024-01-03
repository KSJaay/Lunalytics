// import local files
const cache = require('../../cache');
const { handleError } = require('../../utils/errors');

const monitorDelete = async (request, response) => {
  try {
    const { monitorId } = request.query;

    await cache.monitor.removeMonitor(monitorId);
    return response.sendStatus(200);
  } catch (error) {
    return handleError(error, response);
  }
};

module.exports = monitorDelete;
