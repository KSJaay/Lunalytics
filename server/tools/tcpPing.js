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
    timeout: monitor.interval * 1000 || 5000,
  };

  socket.setTimeout(options.timeout, function () {
    const latency = Date.now() - startTime;
    socket.destroy();

    logger.error(
      'TCP Status Check',
      `Issue checking monitor ${monitor.monitorId}: TIMED OUT`
    );

    callback(monitor, {
      monitorId: monitor.monitorId,
      status: 'TIMEOUT',
      latency,
      message: 'Ping timed out!',
      isDown: 1,
    });
  });

  socket.connect(options.port, options.address, function () {
    const latency = Date.now() - startTime;
    socket.destroy();

    callback(monitor, {
      monitorId: monitor.monitorId,
      status: 'ALIVE',
      latency,
      message: 'Up and running!',
      isDown: 0,
    });
  });

  socket.on('error', function (error) {
    const latency = Date.now() - startTime;
    socket.destroy();

    logger.error(
      'TCP Status Check',
      `Issue checking monitor ${monitor.monitorId}: ${error.message} `
    );

    callback(monitor, {
      monitorId: monitor.monitorId,
      status: 'ERROR',
      latency,
      message: error.message,
      isDown: 1,
    });
  });
};

export default tcpStatusCheck;
