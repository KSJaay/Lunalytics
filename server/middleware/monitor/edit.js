// import local files
const { handleError, UnprocessableError } = require('../../utils/errors');
const validators = require('../../utils/validators');
const cache = require('../../cache');
const { userExists } = require('../../database/queries/user');

const monitorEdit = async (request, response) => {
  try {
    const { name, url, method, interval, retryInterval, requestTimeout } =
      request.body;

    const isInvalidMonitor = validators.monitor(
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

    const user = await userExists(request.cookies.access_token);

    const monitor = await cache.monitors.edit({
      name,
      url,
      method,
      interval,
      retryInterval,
      requestTimeout,
      email: user.email,
    });

    return response.json(monitor);
  } catch (error) {
    return handleError(error, response);
  }
};

module.exports = monitorEdit;
