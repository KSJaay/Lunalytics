const StatusCustomHTMLSchema = {
  id: { _type: 'string' },
  type: { _type: 'string', _validate: (value) => value === 'customHTML' },
  content: { _type: 'string', _validate: (value) => value?.length > 0 },
};

export default StatusCustomHTMLSchema;
