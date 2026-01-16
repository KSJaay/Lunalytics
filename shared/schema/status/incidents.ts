import {
  statusDesign,
  statusIncidents,
  statusSizes,
} from '../../constants/status.js';

const StatusIncidentsSchema = {
  id: { _type: 'string', _required: true },
  type: {
    _type: 'string',
    _validate: (value: string) => value === 'incidents',
    _required: true,
  },
  design: {
    _type: 'string',
    _validate: (value: string) => statusDesign.includes(value),
    _required: true,
  },
  size: {
    _type: 'string',
    _validate: (value: string) => statusSizes.includes(value),
    _required: true,
  },
  titleSize: {
    _type: 'string',
    _validate: (value: string) => statusSizes.includes(value),
    _required: true,
  },
  status: {
    _type: 'string',
    _validate: (value: string) => statusIncidents.includes(value),
    _required: true,
  },
};

export default StatusIncidentsSchema;
