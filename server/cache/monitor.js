const { default: axios } = require('axios');
const {
  fetchMonitor,
  fetchMonitors,
  createHeartbeat,
  deleteMonitor,
  createMonitor,
} = require('../database/queries');
// const { checkCertificate } = require('../utils/checkCertificate');

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

  addHeartbeat(heartbeat) {
    for (let i = 0; i < this.monitors.length; i++) {
      if (this.monitors[i].monitorId === heartbeat.monitorId) {
        this.monitors[i].heartbeats.push(heartbeat);
        this.monitors[i].heartbeats.sort((a, b) => b.date - a.date);

        if (this.monitors[i].heartbeats.length > 12) {
          this.monitors[i].heartbeats.pop();
        }

        break;
      }
    }
  }

  async addMonitor(monitor) {
    const monitorId = await createMonitor(monitor);

    const monitorData = { ...monitor, monitorId, heartbeats: [], uptime: 0 };
    this.monitors.push(monitorData);

    this.checkMonitorStatus(monitorId);
    this.timeouts[monitorId] = setTimeout(
      () => this.checkMonitorStatus(monitorId),
      monitor.interval * 1000
    );

    return monitorData;
  }

  async checkMonitorStatus(monitorId) {
    try {
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

      const query = await axios.request(options);

      const endTime = Date.now();

      const message = `${query.status} - ${query.statusText}`;
      const isDown = query.status >= 400;
      const latency = endTime - startTime;

      const heartbeat = await createHeartbeat(
        monitorId,
        query.status,
        latency,
        message,
        isDown
      );

      this.addHeartbeat(heartbeat);

      clearTimeout(this.timeouts[monitorId]);
      delete this.timeouts[monitorId];
      this.timeouts[monitorId] = setTimeout(
        () => this.checkMonitorStatus(monitorId),
        monitor.interval * 1000
      );
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Monitor;
