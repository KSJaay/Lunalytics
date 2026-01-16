import { hasDate, DateReplacer } from './date.js';

export interface Service {
  monitorId?: string | number;
  name?: string;
  url?: string;
  interval?: number;
  retryInterval?: number;
  requestTimeout?: number;
  method?: string;
  valid_status_codes?: number[];
  email?: string;
  type?: string;
  port?: number;
}

export interface Heartbeat {
  monitorId?: string | number;
  status?: string;
  latency?: number;
  date?: string;
  isDown?: boolean;
  message?: string;
}

const parseJson = (value: any, isString: boolean): string => {
  try {
    return isString
      ? JSON.stringify(value, null, 2)
      : JSON.stringify(value)
          .replace(/[{}]/g, '')
          .replace(/":/g, ': ')
          .replace(/"/g, '')
          .replace(/,/g, '\\n');
  } catch (error) {
    return value;
  }
};

const parseService = (service: Service = {}): string => {
  const {
    monitorId,
    name,
    url,
    interval,
    retryInterval,
    requestTimeout,
    method,
    valid_status_codes,
    email,
    type,
    port,
  } = service;
  return parseJson(
    {
      monitorId,
      name,
      url,
      interval,
      retryInterval,
      requestTimeout,
      method,
      validStatusCodes: valid_status_codes,
      email,
      type,
      port,
    },
    false
  );
};

const parseHeartbeat = (heartbeat: Heartbeat = {}): string => {
  const { monitorId, status, latency, date, isDown, message } = heartbeat;
  return parseJson(
    { monitorId, status, latency, date, isDown, message },
    false
  );
};

type NotificationReplacersType = (
  input: string | object,
  service?: Service,
  heartbeat?: Heartbeat,
  isString?: boolean
) => string | object;

const NotificationReplacers: NotificationReplacersType = (
  input,
  service = {},
  heartbeat = {},
  isString = false
) => {
  try {
    const text = typeof input === 'object' ? JSON.stringify(input) : input;

    const replacers: { [key: string]: any } = {
      '{{service_monitorId}}': service.monitorId,
      '{{service_name}}': service.name,
      '{{service_url}}': service.url,
      '{{service_interval}}': service.interval,
      '{{service_retryInterval}}': service.retryInterval,
      '{{service_requestTimeout}}': service.requestTimeout,
      '{{service_method}}': service.method,
      '{{service_validStatusCodes}}': service.valid_status_codes,
      '{{service_email}}': service.email,
      '{{service_type}}': service.type,
      '{{service_port}}': service.port,
      '{{service_address}}': !service.port
        ? service.url
        : `${service.url}:${service.port}`,
      '{{service_json}}': parseJson(service, true),
      '{{service_parsed_json}}': parseService(service),
      '{{heartbeat_status}}': heartbeat.status,
      '{{heartbeat_latency}}': heartbeat.latency,
      '{{heartbeat_date}}': heartbeat.date,
      '{{heartbeat_isDown}}': heartbeat.isDown,
      '{{heartbeat_message}}': heartbeat.message,
      '{{heartbeat_json}}': parseJson(heartbeat, true),
      '{{heartbeat_parsed_json}}': parseHeartbeat(heartbeat),
    };

    const notificationRegex = new RegExp(
      Object.keys(replacers)
        .map((item) => {
          const escapedItem = item.replace(/[{}]/g, '');
          return `{{\\s*${escapedItem}\\s*}}`;
        })
        .join('|'),
      'gi'
    );

    const updatedText = text.replace(
      notificationRegex,
      (matched: string) => replacers[matched.replace(/ /g, '')]
    );

    if (hasDate(updatedText)) {
      return isString
        ? DateReplacer(updatedText, heartbeat)
        : JSON.parse(DateReplacer(updatedText, heartbeat));
    }

    return isString ? updatedText : JSON.parse(updatedText);
  } catch (error) {
    throw error;
  }
};

export default NotificationReplacers;
