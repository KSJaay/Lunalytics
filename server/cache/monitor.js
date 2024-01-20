const { default: axios } = require('axios');
const {
  fetchMonitor,
  fetchMonitors,
  createHeartbeat,
  deleteMonitor,
  createMonitor,
  updateMonitor,
  updateCertificate,
} = require('../database/queries');
const logger = require('../utils/logger');
const { getCertInfo } = require('../utils/checkCertificate');

class Monitor {
  constructor() {
    this.monitors = [];
    this.timeouts = {};
  }

  async getMonitor(monitorId) {
    const monitor = this.monitors.find(
      (monitor) => monitor.monitorId === monitorId
    );

    if (monitor) {
      return monitor;
    }

    const query = await fetchMonitor(monitorId);

    this.monitors.push(query);

    await this.checkMonitorStatus(monitorId);

    this.timeouts[monitorId] = setTimeout(
      () => this.checkMonitorStatus(monitorId),
      1000 * 60 * query.interval
    );

    return query;
  }

  async getMonitors() {
    if (this.monitors.length) {
      return this.monitors;
    }

    const query = await fetchMonitors();

    this.monitors = query;

    for (const monitor of query) {
      await this.checkMonitorStatus(monitor.monitorId);

      this.timeouts[monitor.monitorId] = setTimeout(
        () => this.checkMonitorStatus(monitor.monitorId),
        monitor.interval * 1000
      );
    }

    return query;
  }

  async removeMonitor(monitorId) {
    if (this.timeouts[monitorId]) {
      clearTimeout(this.timeouts[monitorId]);
      delete this.timeouts[monitorId];
    }

    await deleteMonitor(monitorId);

    const index = this.monitors.findIndex(
      (monitor) => monitor.monitorId === monitorId
    );

    if (index !== -1) {
      this.monitors.splice(index, 1);
    }

    return true;
  }

  async addMonitor(monitor) {
    const monitorId = await createMonitor(monitor);

    const monitorData = {
      ...monitor,
      monitorId,
      heartbeats: [],
      uptimePercentage: 0,
      averageHeartbeatLatency: 0,
    };

    this.monitors.push(monitorData);

    this.checkMonitorStatus(monitorId);
    this.timeouts[monitorId] = setTimeout(
      () => this.checkMonitorStatus(monitorId),
      monitor.interval * 1000
    );

    return monitorData;
  }

  async editMonitor(monitor) {
    // Check if monitor exists (if it doesn't exist throws error)
    await this.getMonitor(monitor.monitorId);

    const monitorIndex = this.monitors.findIndex(
      (monitor) => monitor.monitorId === monitor.monitorId
    );

    await updateMonitor(monitor);

    this.monitors[monitorIndex] = monitor;

    clearTimeout(this.timeouts[monitor.monitorId]);

    this.checkMonitorStatus(monitor.monitorId);

    this.timeouts[monitor.monitorId] = setTimeout(
      () => this.checkMonitorStatus(monitor.monitorId),
      monitor.interval * 1000
    );
  }

  async checkMonitorStatus(monitorId) {
    const monitor = this.monitors.find(
      (monitor) => monitor.monitorId === monitorId
    );

    if (!monitor) {
      clearTimeout(this.timeouts[monitorId]);
      delete this.timeouts[monitorId];
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

      await createHeartbeat(monitorId, query.status, latency, message, isDown);

      const newMonitorData = await fetchMonitor(monitorId);

      const monitorIndex = this.monitors.findIndex(
        (monitor) => monitor.monitorId === monitorId
      );

      if (monitorIndex === -1) {
        this.monitors.push(newMonitorData);
      } else {
        this.monitors[monitorIndex] = newMonitorData;
      }

      if (!monitor.cert?.nextCheck || monitor.cert.nextCheck > Date.now()) {
        const cert = await getCertInfo(monitor.url);

        if (cert) {
          await updateCertificate(monitorId, cert);

          // Set next check to 24 hours from now
          monitor.cert = { ...cert, nextCheck: Date.now() + 86400000 };
        }
      }

      clearTimeout(this.timeouts[monitorId]);
      delete this.timeouts[monitorId];
      this.timeouts[monitorId] = setTimeout(
        () => this.checkMonitorStatus(monitorId),
        monitor.interval * 1000
      );
    } catch (error) {
      const endTime = Date.now();

      if (error.response) {
        const failedResponse = error.response;
        const message = `${failedResponse.status} - ${failedResponse.statusText}`;
        const isDown = failedResponse.status >= 400;
        const latency = endTime - startTime;

        await createHeartbeat(
          monitorId,
          failedResponse.status,
          latency,
          message,
          isDown
        );

        const newMonitorData = await fetchMonitor(monitorId);

        const monitorIndex = this.monitors.findIndex(
          (monitor) => monitor.monitorId === monitorId
        );

        if (monitorIndex === -1) {
          this.monitors.push(newMonitorData);
        } else {
          this.monitors[monitorIndex] = newMonitorData;
        }

        clearTimeout(this.timeouts[monitorId]);
        delete this.timeouts[monitorId];
        this.timeouts[monitorId] = setTimeout(
          () => this.checkMonitorStatus(monitorId),
          monitor.interval * 1000
        );
      }

      logger.error(
        'Monitor Cache',
        `Issue checking monitor ${monitorId}: ${error.message} `
      );
    }
  }
}

module.exports = Monitor;
