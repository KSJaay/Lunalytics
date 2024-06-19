// import dependencies
import axios from 'axios';

// import local files
import logger from '../../shared/utils/logger.js';

const httpStatusCheck = async (monitor) => {
  const options = {
    method: monitor.method,
    url: monitor.url,
    timeout: monitor.requestTimeout * 1000,
    signal: AbortSignal.timeout((monitor.requestTimeout + 10) * 1000),
  };

  const startTime = Date.now();

  try {
    const query = await axios.request(options);

    const latency = Date.now() - startTime;
    const message = `${query.status} - ${query.statusText}`;
    const isDown = query.status >= 400 ? 1 : 0;
    const status = query.status;

    return {
      monitorId: monitor.monitorId,
      status,
      latency,
      message,
      isDown,
    };
  } catch (error) {
    const endTime = Date.now();

    logger.error(
      'HTTP Status Check',
      `Issue checking monitor ${monitor.monitorId}: ${error.message}`
    );

    if (error.response) {
      const failedResponse = error.response;
      const message = `${failedResponse.status} - ${failedResponse.statusText}`;
      const isDown = failedResponse.status >= 400;
      const latency = endTime - startTime;
      const status = failedResponse.status;

      return {
        monitorId: monitor.monitorId,
        status,
        latency,
        message,
        isDown,
      };
    }

    return {
      monitorId: monitor.monitorId,
      status: 0,
      latency: endTime - startTime,
      message: error.message,
      isDown: 1,
    };
  }
};

export default httpStatusCheck;
