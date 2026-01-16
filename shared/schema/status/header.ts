import {
  statusAlignments,
  statusRotations,
  statusSizes,
} from '../../constants/status.js';

const StatusHeaderSchema = {
  id: { _type: 'string', _required: true },
  type: {
    _type: 'string',
    _validate: (value: string) => value === 'header',
    _required: true,
  },
  title: {
    _type: 'object',
    _required: true,
    _strictMatch: true,
    _keys: {
      showLogo: { _type: 'boolean' },
      showTitle: { _type: 'boolean' },
      logoSize: {
        _type: 'string',
        _validate: (value: string) => statusSizes.includes(value),
      },
      titleSize: {
        _type: 'string',
        _validate: (value: string) => statusSizes.includes(value),
      },
      rotation: {
        _type: 'string',
        _validate: (value: string) => statusRotations.includes(value),
      },
      alignment: {
        _type: 'string',
        _validate: (value: string) => statusAlignments.includes(value),
      },
      position: {
        _type: 'string',
        _validate: (value: string) => statusAlignments.includes(value),
      },
    },
  },
  status: {
    _type: 'object',
    _required: true,
    _strictMatch: true,
    _keys: {
      showTitle: { _type: 'boolean' },
      showStatus: { _type: 'boolean' },
      titleSize: {
        _type: 'string',
        _validate: (value: string) => statusSizes.includes(value),
      },
      statusSize: {
        _type: 'string',
        _validate: (value: string) => statusSizes.includes(value),
      },
      alignment: {
        _type: 'string',
        _validate: (value: string) => statusAlignments.includes(value),
      },
      position: {
        _type: 'string',
        _validate: (value: string) => statusAlignments.includes(value),
      },
    },
  },
};

export default StatusHeaderSchema;
