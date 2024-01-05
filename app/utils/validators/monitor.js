const validMethods = [
  'DELETE',
  'GET',
  'HEAD',
  'OPTIONS',
  'PATCH',
  'POST',
  'PUT',
];

const monitor = (
  name,
  url,
  method,
  interval,
  retryInterval,
  requestTimeout
) => {
  if (!name || !/^[a-zA-Z0-9-]+$/.test(name)) {
    return 'Please enter a valid name. Only letters, numbers and - are allowed.';
  }

  const urlRegex = /^(http|https):\/\/[^ "]+$/;

  if (!url || !urlRegex.test(url)) {
    return 'Please enter a valid URL.';
  }

  if (!method || !validMethods.includes(method)) {
    return 'Please select a valid method.';
  }

  if (!interval) {
    return 'Please enter a valid interval.';
  }

  if (interval < 20 || interval > 600) {
    return 'Please enter a valid interval. Interval should be between 20 and 600 seconds.';
  }

  if (!retryInterval) {
    return 'Please enter a valid retry interval.';
  }

  if (retryInterval < 20 || retryInterval > 600) {
    return 'Please enter a valid retry interval. Retry interval should be between 20 and 600 seconds.';
  }

  if (!requestTimeout) {
    return 'Please enter a valid request timeout.';
  }

  if (requestTimeout < 20 || requestTimeout > 600) {
    return 'Please enter a valid request timeout. Request timeout should be between 20 and 600 seconds.';
  }

  return null;
};

export default monitor;
