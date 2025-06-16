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
const notificationTypes = ['All', 'Outage', 'Recovery'];
const urlRegex =
  /^https?:\/\/(localhost(:\d{1,5})?|\d{1,3}(\.\d{1,3}){3}:\d{1,5}|[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(:\d{1,5})?)$/g;

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
  if (!url || !urlRegex.test(url)) {
    return 'Please enter a valid URL.';
  }

  if (!url.includes('http://') && !url.includes('https://')) {
    return 'Please enter a valid URL. Only http:// or https:// is allowed.';
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

  if (requestTimeout < 5 || requestTimeout > 600) {
    return 'Please enter a valid request timeout. Request timeout should be between 20 and 600 seconds.';
  }
};

export const notificationType = (notification) => {
  if (!notificationTypes.includes(notification)) {
    return 'Please select a valid notification type.';
  }
};

export const headers = (headers = {}) => {
  if (typeof headers === 'string') {
    try {
      JSON.parse(headers);
    } catch (error) {
      return 'Please enter valid headers. Make sure to follow JSON key/value format.';
    }
  } else if (typeof headers !== 'object' || Array.isArray(headers)) {
    return 'Please enter valid headers. Make sure to follow JSON key/value format.';
  }
};

const body = (body = {}) => {
  if (typeof body === 'string') {
    try {
      JSON.parse(body);
    } catch (error) {
      return 'Please enter valid body. Make sure to follow JSON key/value format.';
    }
  } else if (typeof body !== 'object' || Array.isArray(body)) {
    return 'Please enter valid body. Make sure to follow JSON key/value format.';
  }
};

const validators = {
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
  notificationType,
  headers,
  body,
};

const httpValidators = [
  ['name', 'name'],
  ['type', 'type'],
  ['url', 'httpUrl'],
  ['method', 'httpMethod'],
  ['valid_status_codes', 'httpStatusCodes'],
  ['interval', 'interval'],
  ['retryInterval', 'retryInterval'],
  ['requestTimeout', 'requestTimeout'],
  ['notificationType', 'notificationType'],
  ['headers', 'headers'],
  ['body', 'body'],
];

const tcpValidators = [
  ['name', 'name'],
  ['type', 'type'],
  ['url', 'tcpHost'],
  ['port', 'tcpPort'],
  ['interval', 'interval'],
  ['retryInterval', 'retryInterval'],
  ['requestTimeout', 'requestTimeout'],
  ['notificationType', 'notificationType'],
];

const http = (data) => {
  const errors = {};

  httpValidators.forEach((validator) => {
    const error = validators[validator[1]](data[validator[0]]);
    if (error) {
      errors[validator[0]] = error;
    }
  });

  if (Object.keys(errors).length) {
    return errors;
  }

  return false;
};

const tcp = (data) => {
  const errors = {};
  tcpValidators.forEach((validator) => {
    const error = validators[validator[1]](data[validator[0]]);
    if (error) {
      errors[validator[0]] = error;
    }
  });

  if (Object.keys(errors).length) {
    return errors;
  }

  return false;
};

export default { ...validators, http, tcp };
