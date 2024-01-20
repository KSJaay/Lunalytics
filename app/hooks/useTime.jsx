import { useState } from 'react';

const useTime = () => {
  const timezone =
    window?.localStorage?.getItem('timezone') ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const dateformat =
    window?.localStorage?.getItem('dateformat') || 'DD/MM/YYYY';

  const timeformat = window?.localStorage?.getItem('timeformat') || 'HH:mm:ss';

  const [state, setState] = useState({
    timezone,
    dateformat,
    timeformat,
  });

  const setTimezone = (timezone) => {
    setState((prevState) => ({
      ...prevState,
      timezone,
    }));
    window.localStorage.setItem('timezone', timezone);
  };

  const setDateformat = (dateformat) => {
    setState((prevState) => ({
      ...prevState,
      dateformat,
    }));
    window.localStorage.setItem('dateformat', dateformat);
  };

  const setTimeformat = (timeformat) => {
    setState((prevState) => ({
      ...prevState,
      timeformat,
    }));
    window.localStorage.setItem('timeformat', timeformat);
  };

  return {
    ...state,
    setTimezone,
    setDateformat,
    setTimeformat,
  };
};

export default useTime;
