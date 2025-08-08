import { action, computed, makeObservable, observable } from 'mobx';
import { fetchMonitorById } from '../services/monitor/fetch';

class GlobalStore {
  constructor() {
    this.monitors = observable.map();
    this.timeouts = observable.map();
    this.activeMonitor = null;

    makeObservable(this, {
      monitors: observable,
      timeouts: observable,
      activeMonitor: observable,
      setMonitors: action,
      setMonitor: action,
      addMonitor: action,
      editMonitor: action,
      removeMonitor: action,
      setActiveMonitor: action,
      getMonitor: action,
      allMonitors: computed,
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

    if (this.activeMonitor && this.activeMonitor.monitorId === data.monitorId) {
      this.setActiveMonitor(data.monitorId);
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
        this.timeouts.set(
          monitor.monitorId,
          setTimeout(
            () => func(monitor.monitorId, this.setMonitor),
            monitor.interval * 1000
          )
        );
      }
    }
  };

  addMonitor = (monitor) => {
    this.monitors.set(monitor.monitorId, monitor);

    if (
      this.activeMonitor &&
      this.activeMonitor.monitorId === monitor.monitorId
    ) {
      this.setActiveMonitor(monitor.monitorId);
    }

    this.timeouts.set(
      monitor.monitorId,
      setTimeout(
        () => fetchMonitorById(monitor.monitorId, this.setMonitor),
        monitor.interval * 1000
      )
    );
  };

  get allMonitors() {
    return Array.from(this.monitors.values()) || [];
  }

  removeMonitor = (monitorId) => {
    if (this.timeouts.has(monitorId)) {
      clearTimeout(this.timeouts.get(monitorId));
      this.timeouts.delete(monitorId);
    }

    this.monitors.delete(monitorId);
    this.setActiveMonitor(null);
  };

  getMonitor = (monitorId) => {
    return this.monitors.get(monitorId);
  };

  editMonitor = (monitor) => {
    if (this.monitors.has(monitor.monitorId)) {
      if (this.timeouts.has(monitor.monitorId)) {
        clearTimeout(this.timeouts.get(monitor.monitorId));
        this.timeouts.delete(monitor.monitorId);
      }
      this.monitors.delete(monitor.monitorId);
    }

    this.addMonitor(monitor);
  };

  setActiveMonitor = (monitorId) => {
    if (!monitorId || !this.monitors.has(monitorId)) {
      this.activeMonitor = this.monitors.values().next().value || null;
      return;
    }

    this.activeMonitor = this.monitors.get(monitorId);
  };
}

export default GlobalStore;
