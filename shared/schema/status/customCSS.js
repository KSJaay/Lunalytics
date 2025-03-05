const StatusCustomCSSSchema = {
  id: { _type: 'string' },
  type: { _type: 'string', _validate: (value) => value === 'customCSS' },
  content: { _type: 'string', _validate: (value) => value?.length > 0 },
};

export default StatusCustomCSSSchema;
