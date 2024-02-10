import { action, makeObservable, observable } from 'mobx';
import { fetchMonitorById } from '../services/monitor/fetch';

class GlobalStore {
  constructor() {
    this.monitors = new Map();
    this.timeouts = new Map();

    makeObservable(this, {
      monitors: observable,
      setMonitors: action,
      setMonitor: action,
      addMonitor: action,
      removeMonitor: action,
    });
  }

  setMonitors = (monitors) => {
    for (const monitor of monitors) {
      this.monitors.set(monitor.monitorId, monitor);
    }
  };

  setMonitor = (data, func) => {
    if (this.timeouts.has(data.monitorId)) {
      clearTimeout(this.timeouts.get(data.monitorId));
      this.timeouts.delete(data.monitorId);
    }

    this.monitors.set(data.monitorId, data);

    const nextTimeout = data.nextCheck - Date.now() + 5000;

    if (nextTimeout > 0) {
      this.timeouts.set(
        data.monitorId,
        setTimeout(() => func(data.monitorId, this.setMonitor), nextTimeout)
      );
      return true;
    }

    this.timeouts.set(
      data.monitorId,
      setTimeout(
        () => func(data.monitorId, this.setMonitor),
        data.interval * 1000
      )
    );

    return true;
  };

  setTimeouts = (monitors, func) => {
    for (const monitor of monitors) {
      if (!this.timeouts.has(monitor.monitorId)) {
        const nextTimeout = monitor.nextCheck - Date.now() + 5000;
        const timeoutInterval =
          nextTimeout > 0 ? nextTimeout : monitor.interval * 1000;

        this.timeouts.set(
          monitor.monitorId,
          setTimeout(
            () => func(monitor.monitorId, this.setMonitor),
            timeoutInterval
          )
        );
      }
    }
  };

  addMonitor = (monitor) => {
    this.monitors.set(monitor.monitorId, monitor);

    const nextTimeout = monitor.nextCheck - Date.now() + 5000;
    const timeoutInterval =
      nextTimeout > 0 ? nextTimeout : monitor.interval * 1000;

    this.timeouts.set(
      monitor.monitorId,
      setTimeout(
        () => fetchMonitorById(monitor.monitorId, this.setMonitor),
        timeoutInterval
      )
    );
  };

  getAllMonitors = () => {
    return Array.from(this.monitors.values()) || [];
  };

  removeMonitor = (monitorId) => {
    if (this.timeouts.has(monitorId)) {
      clearTimeout(this.timeouts.get(monitorId));
      this.timeouts.delete(monitorId);
    }

    this.monitors.delete(monitorId);
  };

  getMonitor = (monitorId) => {
    return this.monitors.get(monitorId);
  };

  editMonitor = (monitorId, monitor) => {
    if (this.monitors.has(monitorId)) {
      if (this.timeouts.has(monitorId)) {
        clearTimeout(this.timeouts.get(monitorId));
        this.timeouts.delete(monitorId);
      }
      this.monitors.delete(monitorId, monitor);
    }

    this.addMonitor(monitor);
  };
}

export default GlobalStore;
