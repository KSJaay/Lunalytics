// import dependencies
import net from 'net';

// import local files
import logger from '../utils/logger.js';

const tcpStatusCheck = async (monitor, callback) => {
  const socket = new net.Socket();
  const startTime = Date.now();

  const options = {
    address: monitor.url || '127.0.0.1',
    port: monitor.port || 80,
    timeout: monitor.requestTimeout * 1000 || 5000,
  };

  socket.setTimeout(options.timeout, function () {
    const latency = Date.now() - startTime;
    socket.destroy();

    logger.error('TCP Status Check', {
      message: `Issue checking monitor ${monitor.monitorId}: TIMED OUT`,
    });

    callback(monitor, {
      monitorId: monitor.monitorId,
      workspaceId: monitor.workspaceId,
      status: 504,
      latency,
      message: 'Ping timed out!',
      isDown: true,
    });
  });

  socket.connect(options.port, options.address, function () {
    const latency = Date.now() - startTime;
    socket.destroy();

    callback(monitor, {
      monitorId: monitor.monitorId,
      workspaceId: monitor.workspaceId,
      status: 200,
      latency,
      message: 'Up and running!',
      isDown: false,
    });
  });

  socket.on('error', function (error) {
    const latency = Date.now() - startTime;
    socket.destroy();

    logger.error('TCP Status Check', {
      message: `Issue checking monitor ${monitor.monitorId}: ${error.message}`,
    });

    callback(monitor, {
      monitorId: monitor.monitorId,
      workspaceId: monitor.workspaceId,
      status: 503,
      latency,
      message: error.message,
      isDown: true,
    });
  });
};

export default tcpStatusCheck;
