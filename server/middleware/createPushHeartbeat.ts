import { createHeartbeat } from '../database/queries/heartbeat.js';
import { fetchUsingToken } from '../database/queries/monitor.js';
import { handleError } from '../utils/errors.js';

const createPushHeartbeat = async (request, response) => {
  try {
    const { token, status, message, latency } = request.body;

    if (!token) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const monitor = await fetchUsingToken(token);

    if (!monitor) {
      return response.status(404).json({ error: 'Monitor not found' });
    }

    const heartbeat = {
      monitorId: monitor.monitorId,
      workspaceId: monitor.workspaceId,
      status: status || 'unknown',
      latency: latency || 0,
      message: message || 'Up and running',
      isDown: false,
    };

    await createHeartbeat(heartbeat);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default createPushHeartbeat;
