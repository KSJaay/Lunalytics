const dockerValidators = [
  ['name', 'name'],
  ['type', 'type'],
  ['url', 'dockerUrl'],
  ['interval', 'interval'],
  ['retry', 'retry'],
  ['retryInterval', 'retryInterval'],
  ['requestTimeout', 'requestTimeout'],
  ['notificationType', 'notificationType'],
  ['icon', 'icon'],
];
const validMethods = [
  'DELETE',
  'GET',
  'HEAD',
  'OPTIONS',
  'PATCH',
  'POST',
  'PUT',
];

const jsonOperators = [
  '==',
  '!=',
  '>',
  '>=',
  '<',
  '<=',
  'contains',
  'not_contains',
];

const validTypes = ['docker', 'http', 'json', 'tcp', 'ping', 'push'];
const notificationTypes = ['All', 'Outage', 'Recovery'];
const urlRegex = /^https?:\/\//;

export const type = (type: string) => {
  if (!type || !validTypes.includes(type)) {
    return 'Please select a valid monitor type.';
  }
};

export const name = (name: string) => {
  if (!name || name.length > 64) {
    return 'Please enter a valid name. Maximum length is 64 characters.';
  }
};

export const httpUrl = (url: string, type: string) => {
  if (type === 'ping') {
    if (!url) {
      return 'Please enter a valid URL/IP.';
    }

    return;
  }

  if (!url || !urlRegex.test(url)) {
    return 'Please enter a valid URL. Only http:// or https:// is allowed.';
  }
};

export const httpMethod = (method: string) => {
  if (!method || !validMethods.includes(method)) {
    return 'Please select a valid method.';
  }
};

export const httpStatusCodes = (codes: string) => {
  if (!codes || !codes.length) {
    return 'Please select at least one status code.';
  }
};

export const tcpHost = (host: string) => {
  const isIpv4 = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

  if (!host || !isIpv4.test(host)) {
    return 'Please enter a valid host (Only IPv4 is valid).';
  }
};

export const tcpPort = (port: string | number) => {
  const portNumber = Number(port);

  if (!portNumber || portNumber < 1 || portNumber > 65535) {
    return 'Please enter a valid port.';
  }
};

export const dockerUrl = (url: string) => {
  if (!url) {
    return 'Please enter a valid Docker Container ID.';
  }
};

export const pushUrl = (token: string) => {
  if (!token) {
    return 'Please enter a valid push token.';
  }
};

export const interval = (interval: string | number) => {
  const num = typeof interval === 'string' ? parseInt(interval, 10) : interval;
  if (!num || isNaN(num)) {
    return 'Please enter a valid interval.';
  }
  if (num < 20 || num > 600) {
    return 'Please enter a valid interval. Interval should be between 20 and 600 seconds.';
  }
};

const retry = (retry: number) => {
  if (!retry) {
    return 'Please enter a valid retry.';
  }

  if (retry < 1 || retry > 30) {
    return 'Please enter a valid retry. Retry should be between 1 and 30 times.';
  }
};

export const retryInterval = (retryInterval: number) => {
  if (!retryInterval) {
    return 'Please enter a valid retry interval.';
  }

  if (retryInterval < 20 || retryInterval > 600) {
    return 'Please enter a valid retry interval. Retry interval should be between 20 and 600 seconds.';
  }
};

export const requestTimeout = (requestTimeout: number) => {
  if (!requestTimeout) {
    return 'Please enter a valid request timeout.';
  }

  if (requestTimeout < 20 || requestTimeout > 600) {
    return 'Please enter a valid request timeout. Request timeout should be between 20 and 600 seconds.';
  }
};

export const notificationType = (notification: string) => {
  if (!notificationTypes.includes(notification)) {
    return 'Please select a valid notification type.';
  }
};

export const headers = (headers: Record<string, any> | string = {}) => {
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

const body = (body: Record<string, any> | string = {}) => {
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

const jsonQuery = (value: any[] | undefined) => {
  if (!value || !Array.isArray(value)) {
    return 'Please provide a valid JSON query.';
  }

  const { key, operator, value: jsonValue } = value?.[0] || {};

  if (!key) {
    return 'Please provide a valid JSON key.';
  }

  if (!operator || !jsonOperators.includes(operator)) {
    return 'Please provide a valid operator.';
  }

  if (!jsonValue) {
    return 'Please provide a valid value.';
  }
};

const icon = (value: { id?: string; name?: string; url?: string }) => {
  if (!value.id) {
    return 'Please provide a valid icon ID.';
  }

  if (!value.name) {
    return 'Please provide a valid icon name.';
  }

  if (!value.url) {
    return 'Please provide a valid icon URL.';
  }
};

export interface Validators {
  [key: string]: (...args: any[]) => string | undefined;
}
const validators: Validators = {
  type,
  name,
  dockerUrl,
  httpUrl,
  httpMethod,
  httpStatusCodes,
  pushUrl,
  tcpHost,
  tcpPort,
  interval,
  retry,
  retryInterval,
  requestTimeout,
  notificationType,
  headers,
  body,
  jsonQuery,
  icon,
};
const httpValidators = [
  ['name', 'name'],
  ['type', 'type'],
  ['url', 'httpUrl'],
  ['method', 'httpMethod'],
  ['valid_status_codes', 'httpStatusCodes'],
  ['interval', 'interval'],
  ['retry', 'retry'],
  ['retryInterval', 'retryInterval'],
  ['requestTimeout', 'requestTimeout'],
  ['notificationType', 'notificationType'],
  ['headers', 'headers'],
  ['body', 'body'],
  ['icon', 'icon'],
];

const jsonValidators = [
  ['name', 'name'],
  ['type', 'type'],
  ['url', 'httpUrl'],
  ['method', 'httpMethod'],
  ['interval', 'interval'],
  ['retry', 'retry'],
  ['retryInterval', 'retryInterval'],
  ['requestTimeout', 'requestTimeout'],
  ['notificationType', 'notificationType'],
  ['headers', 'headers'],
  ['body', 'body'],
  ['json_query', 'jsonQuery'],
  ['icon', 'icon'],
];

const pingValidators = [
  ['name', 'name'],
  ['type', 'type'],
  ['url', 'httpUrl'],
  ['interval', 'interval'],
  ['retry', 'retry'],
  ['retryInterval', 'retryInterval'],
  ['requestTimeout', 'requestTimeout'],
  ['notificationType', 'notificationType'],
  ['icon', 'icon'],
];

const pushValidators = [
  ['name', 'name'],
  ['type', 'type'],
  ['url', 'pushUrl'],
  ['interval', 'interval'],
  ['retry', 'retry'],
  ['retryInterval', 'retryInterval'],
  ['requestTimeout', 'requestTimeout'],
  ['notificationType', 'notificationType'],
  ['icon', 'icon'],
];

const tcpValidators = [
  ['name', 'name'],
  ['type', 'type'],
  ['url', 'tcpHost'],
  ['port', 'tcpPort'],
  ['interval', 'interval'],
  ['retry', 'retry'],
  ['retryInterval', 'retryInterval'],
  ['requestTimeout', 'requestTimeout'],
  ['notificationType', 'notificationType'],
  ['icon', 'icon'],
];

export interface MonitorData {
  [key: string]: any;
}
const http = (data: MonitorData) => {
  const errors: Record<string, string> = {};

  httpValidators.forEach(([key, fn]) => {
    const error = validators[fn](data[key]);
    if (error) {
      errors[key] = error;
    }
  });

  if (Object.keys(errors).length) {
    return errors;
  }

  return false;
};

const docker = (data: MonitorData) => {
  const errors: Record<string, string> = {};

  dockerValidators.forEach(([key, fn]) => {
    const error = validators[fn](data[key]);
    if (error) {
      errors[key] = error;
    }
  });

  if (Object.keys(errors).length) {
    return errors;
  }

  return false;
};

const json = (data: MonitorData) => {
  const errors: Record<string, string> = {};

  jsonValidators.forEach(([key, fn]) => {
    const error = validators[fn](data[key]);
    if (error) {
      errors[key] = error;
    }
  });

  if (Object.keys(errors).length) {
    return errors;
  }

  return false;
};

const ping = (data: MonitorData) => {
  const errors: Record<string, string> = {};

  pingValidators.forEach(([key, fn]) => {
    const error = validators[fn](data[key], data.type);
    if (error) {
      errors[key] = error;
    }
  });

  if (Object.keys(errors).length) {
    return errors;
  }

  return false;
};

const push = (data: MonitorData) => {
  const errors: Record<string, string> = {};

  pushValidators.forEach(([key, fn]) => {
    const error = validators[fn](data[key], data.type);
    if (error) {
      errors[key] = error;
    }
  });

  if (Object.keys(errors).length) {
    return errors;
  }

  return false;
};

const tcp = (data: MonitorData) => {
  const errors: Record<string, string> = {};
  tcpValidators.forEach(([key, fn]) => {
    const error = validators[fn](data[key]);
    if (error) {
      errors[key] = error;
    }
  });

  if (Object.keys(errors).length) {
    return errors;
  }

  return false;
};

export default { ...validators, docker, http, json, tcp, ping, push };
