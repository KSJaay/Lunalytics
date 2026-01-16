import { v7 as uuid } from 'uuid';
import { action, makeObservable, observable, toJS } from 'mobx';
import {
  defaultStatusValues,
  statusComponents,
} from '../../shared/constants/status';
import { defaultStatusComponents } from '../constant/status';
import type {
  ContextStatusPageLayoutProps,
  ContextStatusPageProps,
  ContextStatusPageSettingsProps,
} from '../../shared/types/context/status-page';

const getUniqueId = (values: Map<string, any>) => {
  let id = uuid();

  while (values.get(id)) {
    id = uuid();
  }

  return id;
};

class StatusPageStore {
  layout: Map<string, ContextStatusPageLayoutProps>;
  settings: ContextStatusPageSettingsProps;
  listOfIds: string[];

  constructor() {
    this.layout = observable.map();
    this.settings = {
      font: 'Montserrat',
      theme: 'Auto',
      headerBackground: '#ffffff',
      background: '#ffffff',
      textColor: '#000000',
      highlight: '#159215ff',
      url: '',
      logo: '',
      title: '',
      homepageUrl: '',
      isPublic: false,
      hidePaused: false,
    };
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
      resetFullStatusPage: action,
      reorderBlocks: action,
    });
  }

  setData = (data: Partial<ContextStatusPageProps>) => {
    this.settings = toJS(data?.settings) || defaultStatusValues;

    const layout = toJS(data?.layout) || defaultStatusComponents;

    for (const component of layout) {
      this.layout.set(component.id, component);
    }

    this.listOfIds = layout.map((component) => component.id);
  };

  setLayout = (layout: ContextStatusPageLayoutProps[]) => {
    if (typeof layout !== 'object' || !Array.isArray(layout)) {
      return;
    }

    const jsLayout = toJS(layout);

    for (const component of jsLayout) {
      this.layout.set(component.id, component);
    }

    this.listOfIds = jsLayout.map((component) => component.id);
  };

  setSettings = (settings: ContextStatusPageSettingsProps) => {
    this.settings = toJS({ ...this.settings, ...settings });
  };

  changeValues = (data: Partial<ContextStatusPageSettingsProps>) => {
    this.setSettings({
      ...this.settings,
      ...data,
    });
  };

  createComponent = (type: string) => {
    // ! Need to move shared files to TypeScript
    const defaultComponent =
      statusComponents[type as keyof typeof statusComponents];

    if (!defaultComponent) {
      return null;
    }

    const id = getUniqueId(this.layout);
    this.layout.set(id, { ...defaultComponent, id });
    this.listOfIds.push(id);
    return id;
  };

  getComponent = (id: string) => {
    const component = this.layout.get(id);

    if (!component) {
      return null;
    }

    return component;
  };

  setComponentValue = (id: string, key: string, value: any) => {
    const component: ContextStatusPageLayoutProps | null =
      this.getComponent(id);

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

  removeComponent = (id: string) => {
    this.layout.delete(id);
  };

  getComponentMonitor = (componentId: string, monitorId: string) => {
    const component = this.getComponent(componentId);

    if (!component) {
      return null;
    }

    if (component?.monitors) {
      return component.monitors.find((monitor) => monitor.id === monitorId);
    }

    return null;
  };

  setMonitorValue = (
    componentId: string,
    monitorId: string,
    key: string,
    value: any
  ) => {
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

  resetStatusPage = (
    settings: ContextStatusPageSettingsProps,
    layout: ContextStatusPageLayoutProps[]
  ) => {
    this.setData({ settings, layout });
  };

  resetFullStatusPage = () => {
    this.setData({
      settings: defaultStatusValues,
      layout: defaultStatusComponents,
    });
  };

  reorderBlocks = (listOfIds: string[]) => {
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

const statusPage = new StatusPageStore();

const useStatusPageContext = () => statusPage;

export default useStatusPageContext;
