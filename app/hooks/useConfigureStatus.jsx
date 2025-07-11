import { useContext, createContext, useState } from 'react';
import { v7 as uuid } from 'uuid';
import { defaultStatusComponents } from '../constant/status';
import {
  defaultStatusValues,
  statusComponents,
} from '../../shared/constants/status';
import { toJS } from 'mobx';

const ConfigureStatusContext = createContext();
export const ConfigureStatusProvider = ConfigureStatusContext.Provider;
const useStatusContext = () => useContext(ConfigureStatusContext);

const getUniqueId = (values = []) => {
  let id = uuid();

  while (values.find((item) => item.id === id)) {
    id = uuid();
  }

  return id;
};

export const useConfigureStatusState = (
  values = defaultStatusValues,
  components = defaultStatusComponents
) => {
  const [data, setData] = useState(toJS(values));

  const [layout, setLayout] = useState(toJS(components));

  const changeValues = (data) => {
    setData((prev) => ({ ...prev, ...data }));
  };

  const createComponent = (type) => {
    const defaultComponent = statusComponents[type];

    if (!defaultComponent) {
      return null;
    }

    const id = getUniqueId(layout);
    return setLayout((prev) => [
      ...prev,
      { id, isMinimized: false, ...defaultComponent },
    ]);
  };

  const getComponent = (id) => {
    const component = layout.find((item) => item.id === id);

    if (!component) {
      return null;
    }

    return component;
  };

  const setComponentValue = (id, key, value) => {
    const component = getComponent(id);

    if (!component) {
      return;
    }

    setLayout((prev) => {
      const index = prev.findIndex((item) => item.id === id);

      const isObject =
        typeof prev[index][key] === 'object' &&
        !Array.isArray(prev[index][key]);

      if (isObject) {
        prev[index][key] = { ...prev[index][key], ...value };
      } else {
        prev[index][key] = value;
      }

      return [...prev];
    });
  };

  const removeComponent = (id) => {
    setLayout((prev) => prev.filter((item) => item.id !== id));
  };

  const getComponentMonitor = (componentId, monitorId) => {
    const component = getComponent(componentId);

    if (!component) {
      return null;
    }

    return component.monitors.find((monitor) => monitor.id === monitorId);
  };

  const setMonitorValue = (componentId, monitorId, key, value) => {
    const component = getComponent(componentId);

    if (!component) return;

    const monitor = component.monitors.find(
      (monitor) => monitor.id === monitorId
    );

    if (!monitor) return;

    setLayout((prev) => {
      const index = prev.findIndex((item) => item.id === componentId);

      if (prev[index]) {
        const monitorIndex = prev[index].monitors.findIndex(
          (monitor) => monitor.id === monitorId
        );

        if (monitorIndex !== -1) {
          prev[index].monitors[monitorIndex][key] = value;
        }
      }

      return [...prev];
    });
  };

  const resetStatusPage = (data, layout) => {
    setData(data);
    setLayout(layout);
  };

  const reorderBlocks = (listOfIds) => {
    setLayout((prev) =>
      listOfIds.map((id) => prev.find((item) => item.id === id))
    );
  };

  return {
    settings: data,
    layout,
    changeValues,
    setComponentValue,
    createComponent,
    getComponent,
    removeComponent,
    getComponentMonitor,
    setMonitorValue,
    resetStatusPage,
    reorderBlocks,
  };
};

export default useStatusContext;
