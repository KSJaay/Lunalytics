import { action, computed, makeObservable, observable } from 'mobx';
import { fetchMonitorById } from '../services/monitor/fetch';
import type { MonitorProps } from '../types/monitor';

class GlobalStore {
  monitors: Map<string, MonitorProps>;
  timeouts: Map<string, NodeJS.Timeout>;
  activeMonitor: MonitorProps | null | undefined;

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

  setMonitors = (monitors: MonitorProps[]) => {
    for (const monitor of monitors) {
      this.monitors.set(monitor.monitorId, monitor);
    }
  };

  setMonitor = (data: MonitorProps, func: (id: string, func: any) => void) => {
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

  setTimeouts = (
    monitors: MonitorProps[],
    func: (id: string, func: any) => void
  ) => {
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

  addMonitor = (monitor: MonitorProps) => {
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

  removeMonitor = (monitorId: string) => {
    if (this.timeouts.has(monitorId)) {
      clearTimeout(this.timeouts.get(monitorId));
      this.timeouts.delete(monitorId);
    }

    this.monitors.delete(monitorId);
    this.setActiveMonitor();
  };

  getMonitor = (monitorId: string) => {
    return this.monitors.get(monitorId);
  };

  editMonitor = (monitor: MonitorProps) => {
    if (this.monitors.has(monitor.monitorId)) {
      if (this.timeouts.has(monitor.monitorId)) {
        clearTimeout(this.timeouts.get(monitor.monitorId));
        this.timeouts.delete(monitor.monitorId);
      }
      this.monitors.delete(monitor.monitorId);
    }

    this.addMonitor(monitor);
  };

  setActiveMonitor = (monitorId?: string) => {
    if (monitorId === 'mobile-reset') {
      this.activeMonitor = null;
      return;
    }

    if (!monitorId || !this.monitors.has(monitorId)) {
      this.activeMonitor = this.monitors.values().next().value || null;
      return;
    }

    this.activeMonitor = this.monitors.get(monitorId);
  };
}

export default GlobalStore;
