import {
  statusBarDesign,
  statusIncidents,
  statusSizes,
} from '../../constants/status.js';

const StatusSchema = {
  id: { _type: 'string', _required: true },
  type: {
    _type: 'string',
    _validate: (value) => value === 'status',
    _required: true,
  },
  icon: { _type: 'boolean', _required: true },
  design: {
    _type: 'string',
    _validate: (value) => statusBarDesign.includes(value),
    _required: true,
  },
  size: {
    _type: 'string',
    _validate: (value) => statusSizes.includes(value),
    _required: true,
  },
  titleSize: {
    _type: 'string',
    _validate: (value) => statusSizes.includes(value),
    _required: true,
  },
  status: {
    _type: 'string',
    _validate: (value) => statusIncidents.includes(value),
    _required: true,
  },
};

export default StatusSchema;
