const StatusCustomHTMLSchema = {
  id: { _type: 'string' },
  type: { _type: 'string', _validate: (value) => value === 'history' },
};

export default StatusCustomHTMLSchema;
