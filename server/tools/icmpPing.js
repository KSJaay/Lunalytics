import ping from 'ping';

const pingStatusCheck = async (monitor) => {
  const timeout = monitor.requestTimeout || 5000;
  const config = { timeout: Math.ceil(timeout / 1000) };
  const startTime = Date.now();

  try {
    const result = await ping.promise.probe(monitor.url, config);

    if (result.alive) {
      return {
        monitorId: monitor.monitorId,
        status: 200,
        latency: Date.now() - startTime,
        message: 'Up and running!',
        isDown: false,
      };
    }

    return {
      monitorId: monitor.monitorId,
      status: 200,
      latency: Date.now() - startTime,
      message: 'Ping timed out!',
      isDown: true,
    };
  } catch (error) {
    logger.error('PING Status Check', {
      message: `Issue checking monitor ${monitor.monitorId}: ${error.message}`,
    });

    return {
      monitorId: monitor.monitorId,
      status: 200,
      latency: Date.now() - startTime,
      message: 'Ping timed out!',
      isDown: true,
    };
  }
};

export default pingStatusCheck;
