import { v7 as uuid } from 'uuid';
import { action, makeObservable, observable, toJS } from 'mobx';
import {
  defaultStatusValues,
  statusComponents,
} from '../../shared/constants/status';
import { defaultStatusComponents } from '../constant/status';

const getUniqueId = (values) => {
  let id = uuid();

  while (values.get(id)) {
    id = uuid();
  }

  return id;
};

class StatusPageStore {
  constructor() {
    this.layout = observable.map();
    this.settings = {};
    this.listOfIds = [];

    makeObservable(this, {
      layout: observable,
      settings: observable,
      listOfIds: observable,
      setData: action,
      setLayout: action,
      setSettings: action,
      changeValues: action,
      createComponent: action,
      getComponent: action,
      setComponentValue: action,
      removeComponent: action,
      getComponentMonitor: action,
      setMonitorValue: action,
      resetStatusPage: action,
      reorderBlocks: action,
    });
  }

  setData = (data = {}) => {
    this.settings = toJS(data?.settings) || defaultStatusValues;

    const layout = toJS(data?.layout) || defaultStatusComponents;

    for (const component of layout) {
      this.layout.set(component.id, component);
    }

    this.listOfIds = layout.map((component) => component.id);
  };

  setLayout = (layout) => {
    if (typeof layout !== 'object' || !Array.isArray(layout)) {
      return;
    }

    const jsLayout = toJS(layout);

    for (const component of jsLayout) {
      this.layout.set(component.id, component);
    }

    this.listOfIds = jsLayout.map((component) => component.id);
  };

  setSettings = (settings) => {
    this.settings = toJS({ ...this.settings, ...settings });
  };

  changeValues = (data) => {
    this.setSettings({
      ...this.settings,
      ...data,
    });
  };

  createComponent = (type) => {
    const defaultComponent = statusComponents[type];

    if (!defaultComponent) {
      return null;
    }

    const id = getUniqueId(this.layout);
    this.layout.set(id, { ...defaultComponent, id });
    this.listOfIds.push(id);
    return id;
  };

  getComponent = (id) => {
    const component = this.layout.get(id);

    if (!component) {
      return null;
    }

    return component;
  };

  setComponentValue = (id, key, value) => {
    const component = this.getComponent(id);

    if (!component) {
      return;
    }

    const isObject =
      typeof component[key] === 'object' && !Array.isArray(component[key]);

    if (isObject) {
      component[key] = { ...component[key], ...value };
    } else {
      component[key] = value;
    }

    this.layout.set(id, component);
  };

  removeComponent = (id) => {
    this.layout.delete(id);
  };

  getComponentMonitor = (componentId, monitorId) => {
    const component = this.getComponent(componentId);

    if (!component) {
      return null;
    }

    return component.monitors.find((monitor) => monitor.id === monitorId);
  };

  setMonitorValue = (componentId, monitorId, key, value) => {
    const component = this.getComponent(componentId);

    if (!component) return;

    const monitor = component.monitors.find(
      (monitor) => monitor.id === monitorId
    );

    if (!monitor) return;

    const monitorIndex = component.monitors.findIndex(
      (monitor) => monitor.id === monitorId
    );

    if (monitorIndex !== -1) {
      component.monitors[monitorIndex][key] = value;
    }

    this.layout.set(componentId, component);
  };

  resetStatusPage = (settings, layout) => {
    this.setData({ settings, layout });
  };

  reorderBlocks = (listOfIds) => {
    this.listOfIds = listOfIds;
  };

  get layoutItems() {
    return this.listOfIds
      .map((id) => {
        if (this.layout.get(id)) {
          return JSON.parse(JSON.stringify(this.layout.get(id)));
        }

        return undefined;
      })
      .filter(Boolean);
  }
}

const useStatusPageContext = new StatusPageStore();

export default useStatusPageContext;
