const { cleanPartialMonitor } = require('../class/monitor');
const {
  fetchMonitor,
  fetchMonitors,
  createMonitor,
  updateMonitor,
  deleteMonitor,
  fetchUptimePercentage,
} = require('../database/queries/monitor');

class Monitor {
  constructor() {
    this.monitors = new Map();
  }

  async get(monitorId) {
    const monitor = this.monitors.get(monitorId);

    if (monitor) {
      return monitor;
    }

    const query = await fetchMonitor(monitorId);

    this.monitors.set(monitorId, query);

    return query;
  }

  async getAll() {
    if (this.monitors.size) {
      return this.monitors.values();
    }

    const query = await fetchMonitors();

    for (const monitor of query) {
      this.monitors.set(monitor.monitorId, cleanPartialMonitor(monitor));
    }

    return query;
  }

  async getKeys() {
    if (this.monitors.size) {
      return this.monitors.keys();
    }

    const query = await fetchMonitors();

    for (const monitor of query) {
      this.monitors.set(monitor.monitorId, monitor);
    }

    return this.monitors.keys();
  }

  async addOrEdit(body, email, isHttp, isEdit) {
    const databaseFunction = isEdit ? updateMonitor : createMonitor;

    if (isHttp) {
      const {
        name,
        url,
        method,
        valid_status_codes,
        interval,
        retryInterval,
        requestTimeout,
      } = body;

      const monitor = {
        name,
        url,
        method,
        interval,
        retryInterval,
        requestTimeout,
        valid_status_codes: JSON.stringify(valid_status_codes),
        email,
        type: 'http',
      };

      if (isEdit) {
        monitor.monitorId = body.monitorId;
      }

      const data = await databaseFunction(monitor);
      const monitorData = {
        ...data,
        uptimePercentage: 0,
        averageHeartbeatLatency: 0,
      };

      this.monitors.set(data.monitorId, monitorData);

      return monitorData;
    } else {
      const { name, url, port, interval, retryInterval, requestTimeout } = body;

      const monitor = {
        name,
        url,
        port,
        interval,
        retryInterval,
        requestTimeout,
        valid_status_codes: '',
        email,
        type: 'tcp',
      };

      if (isEdit) {
        monitor.monitorId = body.monitorId;
      }

      const data = await databaseFunction(monitor);
      const monitorData = {
        ...data,
        uptimePercentage: 0,
        averageHeartbeatLatency: 0,
      };

      this.monitors.set(data.monitorId, monitorData);

      return monitorData;
    }
  }

  async updateUptimePercentage(monitor) {
    if (!monitor) {
      return;
    }

    const { uptimePercentage, averageHeartbeatLatency } =
      await fetchUptimePercentage(monitor.monitorId);

    monitor.uptimePercentage = uptimePercentage;
    monitor.averageHeartbeatLatency = averageHeartbeatLatency;

    this.monitors.set(monitor.monitorId, monitor);
  }

  setInCache(monitorId, monitor) {
    this.monitors.set(monitorId, monitor);
  }

  async delete(monitorId) {
    await deleteMonitor(monitorId);
    this.monitors.delete(monitorId);
  }
}

module.exports = Monitor;
