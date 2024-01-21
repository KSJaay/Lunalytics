// import local files
const { handleError, UnprocessableError } = require('../../utils/errors');
const validate = require('../../utils/validators');
const cache = require('../../cache');

const monitorAdd = async (request, response) => {
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

    const data = await cache.monitors.add({
      name,
      url,
      method,
      interval,
      retryInterval,
      requestTimeout,
      username: user.username,
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
