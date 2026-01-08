// import dependencies
import axios from 'axios';
import https from 'https';
import dns from 'dns';
import { performance } from 'perf_hooks';

// import local files
import logger from '../utils/logger.js';
import { isEmpty } from '../../shared/utils/object.js';

const isDown = (monitor, status) => {
  if (!monitor.valid_status_codes) return false;
  for (const code of monitor.valid_status_codes) {
    const [start, end] = code.split('-').map((s) => parseInt(s));

    if (!end && start === status) {
      return false;
    }

    if (status >= start && status <= end) {
      return false;
    }
  }

  return true;
};

const httpWebsitePingCheck = (options) => {
  return new Promise((resolve, reject) => {
    const timings = {};
    const parsedUrl = new URL(options.url);
    const hostname = parsedUrl.hostname;

    const dnsStart = performance.now();

    dns.lookup(hostname, (err) => {
      if (err) {
        return reject(err);
      }

      timings.dnsLookup = Math.round(performance.now() - dnsStart);

      const requestStart = performance.now();

      const req = https.get(options.url, (res) => {
        timings.firstByte = Math.round(performance.now() - requestStart);
        timings.totalTime = Math.round(performance.now() - requestStart);

        res.on('data', () => {});
        res.on('end', () =>
          resolve({
            status: res.statusCode,
            latency: timings.totalTime,
            message: `${res.statusCode} - ${res.statusMessage}`,
            data: timings,
          })
        );
      });

      req.on('socket', (socket) => {
        socket.on('lookup', () => {
          timings.dnsLookup = Math.round(performance.now() - requestStart);
        });

        socket.on('connect', () => {
          timings.tcpConnection = Math.round(performance.now() - requestStart);
        });

        socket.on('secureConnect', () => {
          timings.sslHandshake =
            Math.round(performance.now() - requestStart) -
            timings.tcpConnection;
        });
      });

      req.on('error', (err) => reject(err));
    });
  });
};

const makeRequest = async (options) => {
  const startTime = performance.now();

  const query = await axios.request(options);

  const latency = Math.round(performance.now() - startTime);
  const message = `${query.status} - ${query.statusText}`;
  const status = query.status;

  return { status, latency, message };
};

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

  if (monitor.ignoreTls) {
    options.httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
  }

  const startTime = Date.now();

  try {
    const query = monitor.url.toLowerCase().startsWith('https')
      ? await httpWebsitePingCheck(options)
      : await makeRequest(options);

    return {
      monitorId: monitor.monitorId,
      workspaceId: monitor.workspaceId,
      isDown: isDown(monitor, query.status),
      ...query,
    };
  } catch (error) {
    const endTime = Date.now();

    logger.error('HTTP Status Check', {
      message: `Issue checking monitor ${monitor.monitorId}: ${error.message}`,
    });

    if (error.response) {
      const failedResponse = error.response;
      const message = `${failedResponse.status} - ${failedResponse.statusText}`;
      const latency = endTime - startTime;
      const status = failedResponse.status;

      return {
        monitorId: monitor.monitorId,
        workspaceId: monitor.workspaceId,
        status,
        latency,
        message,
        isDown: isDown(monitor, status),
      };
    }

    return {
      monitorId: monitor.monitorId,
      workspaceId: monitor.workspaceId,
      status: 0,
      latency: endTime - startTime,
      message: error.message,
      isDown: true,
    };
  }
};

export default httpStatusCheck;
