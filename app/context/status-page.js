import { v7 as uuid } from 'uuid';
import { action, makeObservable, observable } from 'mobx';
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
    // console.log('Updating data here');

    this.settings = data?.settings || defaultStatusValues;

    const layout = data?.layout || defaultStatusComponents;

    for (const component of layout) {
      this.layout.set(component.id, component);
    }

    this.listOfIds = layout.map((component) => component.id);
  };

  setLayout = (layout) => {
    // console.log('Updating layout here');
    if (typeof layout !== 'object' || !Array.isArray(layout)) {
      return;
    }

    for (const component of layout) {
      this.layout.set(component.id, component);
    }

    this.listOfIds = layout.map((component) => component.id);
  };

  setSettings = (settings) => {
    // console.log('Updating settings here');
    this.settings = { ...this.settings, ...settings };
  };

  changeValues = (data) => {
    // console.log('Updating settings here');
    this.setSettings({
      ...this.settings,
      ...data,
    });
  };

  createComponent = (type) => {
    // console.log('Creating component here');
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
    // console.log('Getting component here');
    const component = this.layout.get(id);

    if (!component) {
      return null;
    }

    return component;
  };

  setComponentValue = (id, key, value) => {
    // console.log('Setting component value here');
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
    // console.log('Removing component here');
    this.layout.delete(id);
  };

  getComponentMonitor = (componentId, monitorId) => {
    // console.log('Getting component monitor here');
    const component = this.getComponent(componentId);

    if (!component) {
      return null;
    }

    return component.monitors.find((monitor) => monitor.id === monitorId);
  };

  setMonitorValue = (componentId, monitorId, key, value) => {
    // console.log('Setting monitor value here');
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
    // console.log('Resetting status page here');
    this.setData({ settings, layout });
  };

  reorderBlocks = (listOfIds) => {
    // console.log('Reordering blocks here');
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
