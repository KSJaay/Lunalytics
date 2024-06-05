const validMethods = [
  'DELETE',
  'GET',
  'HEAD',
  'OPTIONS',
  'PATCH',
  'POST',
  'PUT',
];

const validTypes = ['http', 'tcp'];

const http = ({
  name,
  type,
  url,
  method,
  valid_status_codes,
  interval,
  retryInterval,
  requestTimeout,
}) => {
  if (!type || !validTypes.includes(type)) {
    return 'Please select a valid monitor type.';
  }

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
  if (!valid_status_codes || !valid_status_codes.length) {
    return 'Please select at least one status code.';
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
};

const tcp = ({
  type,
  name,
  url,
  port,
  interval,
  retryInterval,
  requestTimeout,
}) => {
  if (!type || !validTypes.includes(type)) {
    return 'Please select a valid monitor type.';
  }

  if (!name || !/^[a-zA-Z0-9-]+$/.test(name)) {
    return 'Please enter a valid name. Only letters, numbers and - are allowed.';
  }

  const isIpv4 = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

  if (!url || !isIpv4.test(url)) {
    return 'Please enter a valid host (Only IPv4 is valid).';
  }

  if (!port || port < 1 || port > 65535) {
    return 'Please enter a valid port.';
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
};

export { http, tcp };
