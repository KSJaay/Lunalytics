// import local files
const { handleError, UnprocessableError } = require('../../utils/errors');
const validators = require('../../utils/validators');
const cache = require('../../cache');
const { userExists } = require('../../database/queries/user');

const monitorAdd = async (request, response) => {
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

    const data = await cache.monitors.add({
      name,
      url,
      method,
      interval,
      retryInterval,
      requestTimeout,
      email: user.email,
    });

    await cache.setTimeout(data.monitorId, data.interval);

    const heartbeats = await cache.heartbeats.get(data.monitorId);
    const cert = await cache.certificates.get(data.monitorId);

    const monitor = {
      ...data,
      heartbeats,
      cert,
    };

    return response.json(monitor);
  } catch (error) {
    return handleError(error, response);
  }
};

module.exports = monitorAdd;
