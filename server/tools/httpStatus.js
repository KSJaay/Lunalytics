// import dependencies
import axios from 'axios';
import https from 'https';

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
    const query = await axios.request(options);

    const latency = Date.now() - startTime;
    const message = `${query.status} - ${query.statusText}`;
    const status = query.status;

    return {
      monitorId: monitor.monitorId,
      status,
      latency,
      message,
      isDown: isDown(monitor, status),
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
        status,
        latency,
        message,
        isDown: isDown(monitor, status),
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

// Ping check that provides a lot more information
// import dns from 'dns';
// import https from 'https';
// import { performance } from 'perf_hooks';

// export const pingWebsite = (url) => {
//   return new Promise((resolve, reject) => {
//     const timings = {};
//     const parsedUrl = new URL(url);
//     const hostname = parsedUrl.hostname;

//     const dnsStart = performance.now();

//     dns.lookup(hostname, (err) => {
//       if (err) {
//         return reject(err);
//       }

//       timings.dnsLookup = performance.now() - dnsStart;

//       const requestStart = performance.now();

//       const req = https.get(url, (res) => {
//         timings.firstByte = performance.now() - requestStart;
//         timings.totalTime = performance.now() - start;

//         res.on('data', () => {}); // Prevents memory leak
//         res.on('end', () => resolve(timings));
//       });

//       req.on('socket', (socket) => {
//         socket.on('lookup', () => {
//           timings.dnsLookup = performance.now() - start;
//         });

//         socket.on('connect', () => {
//           timings.tcpConnection = performance.now() - requestStart;
//         });

//         socket.on('secureConnect', () => {
//           timings.sslHandshake =
//             performance.now() - requestStart - timings.tcpConnection;
//         });
//       });

//       req.on('error', (err) => reject(err));
//     });
//   });
// };
