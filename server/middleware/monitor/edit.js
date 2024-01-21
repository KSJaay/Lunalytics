// import local files
const { handleError, UnprocessableError } = require('../../utils/errors');
const validate = require('../../utils/validators');
const cache = require('../../cache');

const monitorEdit = async (request, response) => {
  try {
    const { name, url, method, interval, retryInterval, requestTimeout } =
      request.body;

    const isInvalidMonitor = validate.monitor(
      name,
      url,
      method,
      interval,
      retryInterval,
      requestTimeout
    );

    if (isInvalidMonitor) {
      throw new UnprocessableError(isInvalidMonitor);
    }

    const user = JSON.parse(request.cookies.user);

    if (!user) {
      throw new UnprocessableError('Unable to find valid user cookies');
    }

    const monitor = await cache.monitors.edit({
      name,
      url,
      method,
      interval,
      retryInterval,
      requestTimeout,
      username: user.username,
    });

    return response.json(monitor);
  } catch (error) {
    return handleError(error, response);
  }
};

module.exports = monitorEdit;
