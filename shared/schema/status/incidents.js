import {
  statusDesign,
  statusIncidents,
  statusSizes,
} from '../../constants/status.js';

const StatusIncidentsSchema = {
  id: { _type: 'string' },
  type: { _type: 'string', _validate: (value) => value === 'incidents' },
  design: {
    _type: 'string',
    _validate: (value) => statusDesign.includes(value),
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

export default StatusIncidentsSchema;
