import { action, computed, makeObservable, observable } from 'mobx';

class StatusStore {
  constructor() {
    this.statusPages = observable.map();

    makeObservable(this, {
      statusPages: observable,
      setStatusPages: action,
      addStatusPage: action,
      deleteStatusPage: action,
      getStatusById: action,
      getStatusByUrl: action,
      allStatusPages: computed,
    });
  }

  setStatusPages = (statusPages) => {
    for (const statusPage of statusPages) {
      this.statusPages.set(statusPage.statusId, statusPage);
    }
  };

  addStatusPage = (statusPage) => {
    this.statusPages.set(statusPage.statusId, statusPage);
  };

  deleteStatusPage = (id) => {
    this.statusPages.delete(id);
  };

  getStatusById = (id) => {
    return this.statusPages.get(id);
  };

  getStatusByUrl = (url) => {
    return Array.from(this.statusPages.values()).find(
      (statusPage) => statusPage.statusUrl === url
    );
  };

  get allStatusPages() {
    return Array.from(this.statusPages.values()) || [];
  }
}

export default StatusStore;
