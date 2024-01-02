// import local files

const { createMonitor } = require('../../database/queries');
const { handleError, UnprocessableError } = require('../../utils/errors');
const validate = require('../../utils/validators');

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

    const monitorId = await createMonitor(
      user,
      name,
      url,
      interval,
      retryInterval,
      requestTimeout
    );

    return response.json({ monitorId: monitorId });
  } catch (error) {
    return handleError(error, response);
  }
};

module.exports = monitorAdd;
