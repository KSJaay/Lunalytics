import type { MonitorProps } from '../../shared/types/monitor.d.js';

// import dependencies
import { GameDig } from 'gamedig';

// import local files
import logger from '../utils/logger.js';

const gamedigStatusCheck = async (monitor: MonitorProps) => {
  const startTime = Date.now();

  try {
    const { game, url: host, port } = monitor;

    const state = await GameDig.query({ type: game, host, port });

    return {
      monitorId: monitor.monitorId,
      workspaceId: monitor.workspaceId,
      status: 'UP',
      latency: state.ping,
      message: state.name,
      isDown: false,
    };
  } catch (error: any) {
    logger.error('GameDig Status Check', {
      message: `Issue checking monitor ${monitor.monitorId}: ${error.message}`,
      stack: error.stack,
    });

    return {
      monitorId: monitor.monitorId,
      workspaceId: monitor.workspaceId,
      status: 'DOWN',
      latency: Date.now() - startTime,
      message: `GameDig query failed: ${error.message}`,
      isDown: true,
    };
  }
};

export default gamedigStatusCheck;
