import {
  statusGraphDesigns,
  statusIncidents,
  statusIndicators,
} from '../../constants/status.js';

const titleRegex = /^[a-zA-Z0-9_ -]{0,64}$/;

const StatusUptimeSchema = {
  id: { _type: 'string' },
  type: { _type: 'string', _validate: (value) => value === 'uptime' },
  title: { _type: 'string', _validate: (value) => titleRegex.test(value) },
  monitors: { _type: 'array', _required: true },
  autoAdd: { _type: 'boolean' },
  graphType: {
    _type: 'string',
    _validate: (value) => statusGraphDesigns.includes(value),
  },
  statusIndicator: {
    _type: 'string',
    _validate: (value) => statusIndicators.includes(value),
  },
  status: {
    _type: 'string',
    _validate: (value) => statusIncidents.includes(value),
  },
};

export default StatusUptimeSchema;
