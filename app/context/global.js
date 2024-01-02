import { action, makeObservable, observable } from 'mobx';

export default class ModalStore {
  constructor() {
    this.monitors = [];
    makeObservable(this, {
      monitors: observable,
      setMonitors: action,
      addMonitor: action,
      removeMonitor: action,
    });
  }

  setMonitors = (monitors) => {
    this.monitors = monitors;
  };

  addMonitor = (monitor) => {
    this.monitors.push(monitor);
  };

  removeMonitor = (monitorId) => {
    this.monitors = this.monitors.filter((m) => m.monitorId !== monitorId);
  };
}
