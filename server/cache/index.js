// import dependencies
const { default: axios } = require('axios');

// import local files
const logger = require('../utils/logger');

// import classes
const Certificates = require('./certificates');
const Heartbeats = require('./heartbeats');
const Monitor = require('./monitors');
const { getCertInfo } = require('../utils/checkCertificate');

class Master {
  constructor() {
    this.heartbeats = new Heartbeats();
    this.certificates = new Certificates();
    this.monitors = new Monitor();
    this.timeouts = new Map();
  }

  async initialise() {
    const monitors = await this.monitors.getAll();

    for (const monitor of monitors) {
      await this.certificates.get(monitor.monitorId);
      await this.heartbeats.get(monitor.monitorId);
      await this.checkStatus(monitor.monitorId);
    }
  }

  async setTimeout(monitorId, interval = 30) {
    if (this.timeouts.has(monitorId)) {
      clearTimeout(this.timeouts.get(monitorId));
    }

    await this.checkStatus(monitorId);

    this.timeouts.set(
      monitorId,
      setTimeout(() => this.checkStatus(monitorId), interval * 1000)
    );
  }

  async checkStatus(monitorId) {
    const monitor = await this.monitors.get(monitorId).catch(() => false);

    if (!monitor) {
      clearTimeout(this.timeouts.get(monitorId));
      this.timeouts.delete(monitorId);
      await this.certificates.delete(monitorId);
      await this.heartbeats.delete(monitorId);
      return;
    }

    const options = {
      method: monitor.method,
      url: monitor.url,
      timeout: monitor.requestTimeout * 1000,
      signal: AbortSignal.timeout((monitor.requestTimeout + 10) * 1000),
    };

    const startTime = Date.now();

    try {
      const query = await axios.request(options);

      const endTime = Date.now();

      const message = `${query.status} - ${query.statusText}`;

      const isDown = query.status >= 400;
      const latency = endTime - startTime;
      const status = query.status;

      const heartbeat = { monitorId, status, latency, message, isDown };

      await this.heartbeats.add(heartbeat);

      if (monitor.url?.startsWith('https://')) {
        const certificate = await this.certificates.get(monitorId);

        if (!certificate?.nextCheck || certificate.nextCheck <= Date.now()) {
          const cert = await getCertInfo(monitor.url);

          if (cert) {
            await this.certificates.update(monitorId, {
              ...certificate,
              ...cert,
            });
          }
        }
      }
    } catch (error) {
      const endTime = Date.now();

      if (error.response) {
        const failedResponse = error.response;
        const message = `${failedResponse.status} - ${failedResponse.statusText}`;
        const isDown = failedResponse.status >= 400;
        const latency = endTime - startTime;
        const status = failedResponse.status;

        const heartbeat = { monitorId, status, latency, message, isDown };

        await this.heartbeats.add(heartbeat);
      } else {
        await this.heartbeats.add({
          monitorId,
          status: 0,
          latency: 0,
          message: error.message,
          isDown: true,
        });
      }

      logger.error(
        'Monitor Cache',
        `Issue checking monitor ${monitorId}: ${error.message} `
      );
    }

    clearTimeout(this.timeouts.get(monitorId));
    this.timeouts.set(
      monitorId,
      setTimeout(
        () => this.checkStatus(monitor.monitorId),
        monitor.interval * 1000
      )
    );
  }
}

const cache = new Master();

module.exports = cache;
