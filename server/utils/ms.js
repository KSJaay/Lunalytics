const timeToMs = (duration, type = 'hours') => {
  const types = {
    months: 2592000000,
    days: 86400000,
    hours: 3600000,
    minutes: 60000,
    seconds: 1000,
  };

  return duration * types[type];
};

export { timeToMs };
