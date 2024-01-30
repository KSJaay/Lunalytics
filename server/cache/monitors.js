const {
  fetchMonitor,
  fetchMonitors,
  createMonitor,
  updateMonitor,
  deleteMonitor,
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
      this.monitors.set(monitor.monitorId, monitor);
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

  async add(monitor) {
    const data = await createMonitor(monitor);

    const monitorData = {
      ...data,
      uptimePercentage: 0,
      averageHeartbeatLatency: 0,
    };

    this.monitors.set(data.monitorId, monitorData);

    return monitorData;
  }

  async edit(monitor) {
    await updateMonitor(monitor);

    this.monitors.set(monitor.monitorId, monitor);

    return monitor;
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
