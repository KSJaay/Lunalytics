import { useContext, createContext, useState, useLayoutEffect } from 'react';

const LocalStorageStateContext = createContext({});
export const LocalStorageStateProvider = LocalStorageStateContext.Provider;
const useLocalStorageContext = () => useContext(LocalStorageStateContext);

export const useLocalStorageState = () => {
  const [values, setValues] = useState({
    timezone: 'Europe/London',
    dateformat: 'DD/MM/YYYY',
    timeformat: 'HH:mm:ss',
    theme: 'dark',
    color: 'Green',
    layout: 'cards',
    status: 'all',
  });

  useLayoutEffect(() => {
    const timezone =
      window?.localStorage?.getItem('timezone') ||
      Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dateformat =
      window?.localStorage?.getItem('dateformat') || 'DD/MM/YYYY';
    const timeformat =
      window?.localStorage?.getItem('timeformat') || 'HH:mm:ss';
    const theme = window?.localStorage?.getItem('theme') || 'dark';
    const color = window?.localStorage?.getItem('color') || 'Green';
    const layout = window?.localStorage?.getItem('layout') || 'compact';
    const status = window?.localStorage?.getItem('status') || 'all';

    setValues((prevState) => ({
      ...prevState,
      timezone,
      dateformat,
      timeformat,
      theme,
      color,
      layout,
      status,
    }));

    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.color = color;
  }, []);

  const setTimezone = (timezone: string) => {
    setValues((prevState) => ({
      ...prevState,
      timezone,
    }));
    window.localStorage.setItem('timezone', timezone);
  };

  const setDateformat = (dateformat: string) => {
    setValues((prevState) => ({
      ...prevState,
      dateformat,
    }));
    window.localStorage.setItem('dateformat', dateformat);
  };

  const setTimeformat = (timeformat: string) => {
    setValues((prevState) => ({
      ...prevState,
      timeformat,
    }));
    window.localStorage.setItem('timeformat', timeformat);
  };

  const setTheme = (theme: string) => {
    setValues((prevState) => ({
      ...prevState,
      theme,
    }));
    window.localStorage.setItem('theme', theme);
    document.documentElement.dataset.theme = theme;
  };

  const setColor = (color: string) => {
    setValues((prevState) => ({
      ...prevState,
      color,
    }));
    window.localStorage.setItem('color', color);
    document.documentElement.dataset.color = color;
  };

  const setLayout = (layout: string) => {
    setValues((prevState) => ({
      ...prevState,
      layout,
    }));
    window.localStorage.setItem('layout', layout);
  };

  const setStatus = (status: string) => {
    setValues((prevState) => ({
      ...prevState,
      status,
    }));
    window.localStorage.setItem('status', status);
  };

  return {
    ...values,
    setTimezone,
    setDateformat,
    setTimeformat,
    setTheme,
    setColor,
    setLayout,
    setStatus,
  };
};

export default useLocalStorageContext;
