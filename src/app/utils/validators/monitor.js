// name
// URL
// interval
// Retry interval
// Timeout

const monitor = (name, url, interval, retryInterval, requestTimeout) => {
  // name should only include letters, numbers and -
  if (!name || !/^[a-zA-Z0-9-]+$/.test(name)) {
    return 'Please enter a valid name. Only letters, numbers and - are allowed.';
  }

  // is url valid
  const urlRegex = /^(http|https):\/\/[^ "]+$/;

  if (!url || !urlRegex.test(values.url)) {
    return 'Please enter a valid URL.';
  }

  if (!interval) {
    return 'Please enter a valid interval.';
  }

  if (values.interval < 20 || values.interval > 600) {
    return 'Please enter a valid interval. Interval should be between 20 and 600 seconds.';
  }

  if (!retryInterval) {
    return 'Please enter a valid retry interval.';
  }

  if (values.retryInterval < 20 || values.retryInterval > 600) {
    return 'Please enter a valid retry interval. Retry interval should be between 20 and 600 seconds.';
  }

  if (!timeout) {
    return 'Please enter a valid timeout.';
  }

  if (values.timeout < 20 || values.timeout > 600) {
    return 'Please enter a valid timeout. Timeout should be between 20 and 600 seconds.';
  }

  if (!requestTimeout) {
    return 'Please enter a valid request timeout.';
  }

  if (values.requestTimeout < 20 || values.requestTimeout > 600) {
    return 'Please enter a valid request timeout. Request timeout should be between 20 and 600 seconds.';
  }

  return null;
};

export default monitor;
