import {
  statusGraphDesigns,
  statusIncidents,
  statusIndicators,
} from '../../constants/status.js';

const titleRegex = /^[a-zA-Z0-9_ -]{0,64}$/;

const StatusUptimeSchema = {
  id: { _type: 'string', _required: true },
  type: {
    _type: 'string',
    _validate: (value: string) => value === 'uptime',
    _required: true,
  },
  title: {
    _type: 'string',
    _validate: (value: string) => titleRegex.test(value),
    _required: true,
  },
  monitors: { _type: 'array', _required: true },
  autoAdd: { _type: 'boolean', _required: true },
  graphType: {
    _type: 'string',
    _validate: (value: string) => statusGraphDesigns.includes(value),
    _required: true,
  },
  statusIndicator: {
    _type: 'string',
    _validate: (value: string) => statusIndicators.includes(value),
    _required: true,
  },
  status: {
    _type: 'string',
    _validate: (value: string) => statusIncidents.includes(value),
    _required: true,
  },
};

export default StatusUptimeSchema;
