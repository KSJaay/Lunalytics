const StatusCustomHTMLSchema = {
  id: { _type: 'string', _required: true },
  type: {
    _type: 'string',
    _validate: (value: string) => value === 'history',
    _required: true,
  },
};

export default StatusCustomHTMLSchema;
