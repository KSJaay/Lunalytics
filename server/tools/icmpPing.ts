import type { MonitorProps } from '../../shared/types/monitor.d.js';
import ping from 'ping';
import logger from '../utils/logger.js';

const pingStatusCheck = async (monitor: MonitorProps) => {
  const timeout = monitor.requestTimeout || 5;
  const config = { timeout: Math.ceil(timeout) };
  const startTime = Date.now();

  try {
    const result = await ping.promise.probe(monitor.url, config);

    if (result.alive) {
      return {
        monitorId: monitor.monitorId,
        workspaceId: monitor.workspaceId,
        status: 200,
        latency: Date.now() - startTime,
        message: 'Up and running!',
        isDown: false,
      };
    }

    return {
      monitorId: monitor.monitorId,
      workspaceId: monitor.workspaceId,
      status: 200,
      latency: Date.now() - startTime,
      message: 'Ping timed out!',
      isDown: true,
    };
  } catch (error: any) {
    logger.error('PING Status Check', {
      message: `Issue checking monitor ${monitor.monitorId}: ${error.message}`,
      stack: error.stack,
    });

    return {
      monitorId: monitor.monitorId,
      workspaceId: monitor.workspaceId,
      status: 200,
      latency: Date.now() - startTime,
      message: 'Ping timed out!',
      isDown: true,
    };
  }
};

export default pingStatusCheck;
