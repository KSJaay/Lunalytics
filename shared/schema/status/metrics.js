import {
  statusGraphDesigns,
  statusGraphTypes,
} from '../../constants/status.js';

const titleRegex = /^[a-zA-Z0-9_ -]{0,64}$/;

const StatusMetricsSchema = {
  id: { _type: 'string', _required: true },
  type: {
    _type: 'string',
    _validate: (value) => value === 'metrics',
    _required: true,
  },
  title: {
    _type: 'string',
    _validate: (value) => titleRegex.test(value),
    _required: true,
  },
  autoAdd: { _type: 'boolean', _required: true },
  graphType: {
    _type: 'string',
    _validate: (value) => statusGraphTypes.includes(value),
    _required: true,
  },
  data: {
    _type: 'object',
    _required: true,
    _strictMatch: true,
    _keys: {
      showName: { _type: 'boolean', _required: true },
      showPing: { _type: 'boolean', _required: true },
    },
  },
  monitors: {
    _type: 'array',
    _required: true,
    _strictMatch: true,
    _keys: {
      id: { _type: 'string', _required: true },
      title: {
        _type: 'string',
        _validate: (value) => titleRegex.test(value),
        _required: true,
      },
      graphType: {
        _type: 'string',
        _validate: (value) => statusGraphDesigns.includes(value),
        _required: true,
      },
      showPing: { _type: 'boolean', _required: true },
    },
  },
};

export default StatusMetricsSchema;
