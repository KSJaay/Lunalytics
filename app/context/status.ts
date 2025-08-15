import { action, computed, makeObservable, observable } from 'mobx';
import type { ContextStatusProps } from '../types/context/status';

class StatusStore {
  statusPages: Map<string, ContextStatusProps>;
  activeStatusPage: ContextStatusProps | null | undefined;

  constructor() {
    this.statusPages = observable.map();
    this.activeStatusPage = null;

    makeObservable(this, {
      statusPages: observable,
      activeStatusPage: observable,
      setStatusPages: action,
      addStatusPage: action,
      deleteStatusPage: action,
      getStatusById: action,
      getStatusByUrl: action,
      allStatusPages: computed,
      setActiveStatusPage: action,
    });
  }

  setStatusPages = (statusPages: ContextStatusProps[]) => {
    for (const statusPage of statusPages) {
      this.statusPages.set(statusPage.statusId, statusPage);
    }
  };

  addStatusPage = (statusPage: ContextStatusProps) => {
    this.statusPages.set(statusPage.statusId, statusPage);

    if (this.activeStatusPage?.statusId === statusPage.statusId) {
      this.setActiveStatusPage(statusPage.statusId);
    }
  };

  deleteStatusPage = (id: string) => {
    this.statusPages.delete(id);
    this.setActiveStatusPage(null);
  };

  getStatusById = (id: string) => {
    return this.statusPages.get(id);
  };

  getStatusByUrl = (url: string) => {
    return Array.from(this.statusPages.values()).find(
      (statusPage) => statusPage.statusUrl === url
    );
  };

  get allStatusPages() {
    return Array.from(this.statusPages.values()) || [];
  }

  setActiveStatusPage = (id: string | null | undefined) => {
    if (!id || !this.statusPages.has(id)) {
      this.activeStatusPage = this.statusPages.values().next().value || null;
      return;
    }

    this.activeStatusPage = this.statusPages.get(id);
  };
}

export default StatusStore;
