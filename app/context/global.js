import { action, makeObservable, observable } from 'mobx';
import { fetchMonitorById } from '../services/monitor/fetch';

export default class ModalStore {
  constructor() {
    this.monitors = [];
    this.timeouts = {};
    makeObservable(this, {
      monitors: observable,
      setMonitors: action,
      setMonitor: action,
      addMonitor: action,
      removeMonitor: action,
    });
  }

  setMonitors = (monitors) => {
    this.monitors = monitors;
  };

  setMonitor = (data, func) => {
    const index = this.monitors.findIndex(
      (m) => m.monitorId === data.monitorId
    );

    if (index === -1) {
      this.monitors.push(data);

      if (this.timeouts[data.monitorId]) {
        delete this.timeouts[data.monitorId];
      }

      this.timeouts[data.monitorId] = setTimeout(
        () => func(data.monitorId, this.setMonitor),
        data.interval * 1000
      );

      return true;
    }

    this.monitors[index] = data;
    if (this.timeouts[data.monitorId]) {
      delete this.timeouts[data.monitorId];
    }
    this.timeouts[data.monitorId] = setTimeout(
      () => func(data.monitorId, this.setMonitor),
      data.interval * 1000
    );

    return true;
  };

  setTimeouts = (monitors, func) => {
    for (const monitor of monitors) {
      if (!this.timeouts[monitor.monitorId]) {
        this.timeouts[monitor.monitorId] = setTimeout(
          () => func(monitor.monitorId, this.setMonitor),
          monitor.interval * 1000
        );
      }
    }
  };

  addMonitor = (monitor) => {
    this.monitors.push(monitor);

    this.timeouts[monitor.monitorId] = setTimeout(
      () => fetchMonitorById(monitor.monitorId, this.setMonitor),
      monitor.interval * 1000
    );
  };

  removeMonitor = (monitorId) => {
    this.monitors = this.monitors.filter((m) => m.monitorId !== monitorId);
    if (this.timeouts[monitorId]) {
      clearTimeout(this.timeouts[monitorId]);
      delete this.timeouts[monitorId];
    }
  };

  getMonitor = (monitorId) => {
    return this.monitors.find((m) => m.monitorId === monitorId);
  };
}
