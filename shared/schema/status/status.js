import {
  statusBarDesign,
  statusIncidents,
  statusSizes,
} from '../../constants/status.js';

const StatusSchema = {
  id: { _type: 'string' },
  type: { _type: 'string', _validate: (value) => value === 'status' },
  icon: { _type: 'boolean' },
  design: {
    _type: 'string',
    _validate: (value) => statusBarDesign.includes(value),
  },
  size: { _type: 'string', _validate: (value) => statusSizes.includes(value) },
  titleSize: {
    _type: 'string',
    _validate: (value) => statusSizes.includes(value),
  },
  status: {
    _type: 'string',
    _validate: (value) => statusIncidents.includes(value),
  },
};

export default StatusSchema;
