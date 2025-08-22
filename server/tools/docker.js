import http from 'http';
import logger from '../utils/logger.js';

const getMessage = (container) => {
  const { Running, Paused, Restarting, Dead } = container.State;

  if (Running) return 'Container is running';
  if (Paused) return 'Container is paused';
  if (Restarting) return 'Container is restarting';
  if (Dead) return 'Container is dead';

  return `Container state: ${container.State.Status}`;
};

const dockerRequest = (
  path,
  socketPath = '/var/run/docker.sock',
  method = 'GET'
) => {
  return new Promise((resolve, reject) => {
    const options = {
      socketPath,
      path,
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(`Failed to parse response: ${e}`);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
};

const dockerStatusCheck = async (monitor) => {
  const startTime = Date.now();

  try {
    const container = await dockerRequest(`/containers/${monitor.url}/json`);

    if (!container) {
      throw new Error('Unable to find container with the given ID');
    }

    const isRunning =
      container.State.Status === 'running' && container.State.Running === true;
    const health = container.State.Health?.Status || 'no healthcheck';

    return {
      monitorId: monitor.monitorId,
      status: health,
      latency: Date.now() - startTime,
      message: getMessage(container),
      isDown: !isRunning,
    };
  } catch (error) {
    logger.error('Docker Container Status Check', {
      message: `Issue checking monitor ${monitor.monitorId}: ${error.message}`,
    });

    return {
      monitorId: monitor.monitorId,
      status: 'down',
      latency: Date.now() - startTime,
      message: `Unknown container state`,
      isDown: true,
    };
  }
};

export const getListOfDockerContainers = async () => {
  try {
    const containers = await dockerRequest('/containers/json?all=true');

    return containers;
  } catch (err) {
    logger.error('Docker error:', {
      message: err.message,
      stack: err.stack,
    });

    return [];
  }
};

export default dockerStatusCheck;
