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

export const type = (type) => {
  if (!type || !validTypes.includes(type)) {
    return 'Please select a valid monitor type.';
  }
};

export const name = (name) => {
  if (!name || !/^[a-zA-Z0-9-]+$/.test(name)) {
    return 'Please enter a valid name. Only letters, numbers and - are allowed.';
  }
};

export const httpUrl = (url) => {
  const urlRegex = /^(http|https):\/\/[^ "]+$/;

  if (!url || !urlRegex.test(url)) {
    return 'Please enter a valid URL.';
  }
};

export const httpMethod = (method) => {
  if (!method || !validMethods.includes(method)) {
    return 'Please select a valid method.';
  }
};

export const httpStatusCodes = (codes) => {
  if (!codes || !codes.length) {
    return 'Please select at least one status code.';
  }
};

export const tcpHost = (host) => {
  const isIpv4 = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

  if (!host || !isIpv4.test(host)) {
    return 'Please enter a valid host (Only IPv4 is valid).';
  }
};

export const tcpPort = (port) => {
  if (!port || port < 1 || port > 65535) {
    return 'Please enter a valid port.';
  }
};

export const interval = (interval) => {
  if (!interval) {
    return 'Please enter a valid interval.';
  }

  if (interval < 20 || interval > 600) {
    return 'Please enter a valid interval. Interval should be between 20 and 600 seconds.';
  }
};

export const retryInterval = (retryInterval) => {
  if (!retryInterval) {
    return 'Please enter a valid retry interval.';
  }

  if (retryInterval < 20 || retryInterval > 600) {
    return 'Please enter a valid retry interval. Retry interval should be between 20 and 600 seconds.';
  }
};

export const requestTimeout = (requestTimeout) => {
  if (!requestTimeout) {
    return 'Please enter a valid request timeout.';
  }

  if (requestTimeout < 20 || requestTimeout > 600) {
    return 'Please enter a valid request timeout. Request timeout should be between 20 and 600 seconds.';
  }
};

const monitorValidators = {
  type,
  name,
  httpUrl,
  httpMethod,
  httpStatusCodes,
  tcpHost,
  tcpPort,
  interval,
  retryInterval,
  requestTimeout,
};

export default monitorValidators;
