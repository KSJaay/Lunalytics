const StatusCustomHTMLSchema = {
  id: { _type: 'string', _required: true },
  type: {
    _type: 'string',
    _validate: (value: string) => value === 'customHTML',
    _required: true,
  },
  content: {
    _type: 'string',
    _validate: (value: string) => value?.length > 0,
    _required: true,
  },
};

export default StatusCustomHTMLSchema;
