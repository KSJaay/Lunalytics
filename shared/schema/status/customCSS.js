const StatusCustomCSSSchema = {
  id: { _type: 'string', _required: true },
  type: {
    _type: 'string',
    _validate: (value) => value === 'customCSS',
    _required: true,
  },
  content: {
    _type: 'string',
    _validate: (value) => value?.length > 0,
    _required: true,
  },
};

export default StatusCustomCSSSchema;
