import type { MonitorProps } from '../../shared/types/monitor.d.js';

// import local files
import logger from '../utils/logger.js';
import { fetchHeartbeats } from '../database/queries/heartbeat.js';

const pushStatusCheck = async (monitor: MonitorProps) => {
  const startTime = Date.now();

  try {
    const [query] = await fetchHeartbeats(monitor.monitorId, 1);

    const interval = monitor.interval || 0;

    const heartbeatCreatedAt = new Date(query.date).getTime();
    const intervalInMs = interval * 1000;
    const expiryDate = heartbeatCreatedAt + intervalInMs;

    if (Date.now() > expiryDate) {
      return {
        monitorId: monitor.monitorId,
        workspaceId: monitor.workspaceId,
        status: 'Unknown',
        latency: Date.now() - startTime,
        message: 'No PUSH notification received',
        isDown: true,
      };
    }

    return false;
  } catch (error: any) {
    logger.error('PUSH Status Check', {
      message: `Issue checking monitor ${monitor.monitorId}: ${error.message}`,
      stack: error.stack,
    });

    return {
      monitorId: monitor.monitorId,
      workspaceId: monitor.workspaceId,
      status: 'Unknown',
      latency: Date.now() - startTime,
      message: 'No PUSH notification received',
      isDown: true,
    };
  }
};

export default pushStatusCheck;
