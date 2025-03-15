// import dependencies
import axios from 'axios';

// import local files
import logger from '../utils/logger.js';
import { isEmpty } from '../../shared/utils/object.js';

const httpStatusCheck = async (monitor) => {
  const options = {
    method: monitor.method,
    url: monitor.url,
    timeout: monitor.requestTimeout * 1000,
    signal: AbortSignal.timeout((monitor.requestTimeout + 10) * 1000),
  };

  if (!isEmpty(monitor.headers)) {
    options.headers = { ...monitor.headers };
  }

  if (!isEmpty(monitor.body)) {
    options.data = { ...monitor.body };
  }

  const startTime = Date.now();

  try {
    const query = await axios.request(options);

    const latency = Date.now() - startTime;
    const message = `${query.status} - ${query.statusText}`;
    let isDown = true;

    for (const status of monitor.valid_status_codes) {
      const [start, end] = status.split('-').map((s) => parseInt(s));

      if (!end && start === query.status) {
        isDown = false;
        break;
      }

      if (query.status >= start && query.status <= end) {
        isDown = false;
        break;
      }
    }

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

    logger.error('HTTP Status Check', {
      message: `Issue checking monitor ${monitor.monitorId}: ${error.message}`,
    });

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
      isDown: true,
    };
  }
};

export default httpStatusCheck;
