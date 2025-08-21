const PushoverSchema = {};

const PushoverTemplateMessages = {
  basic: {
    title: 'Service Down',
    message: 'Service {{service_name}} is down!',
  },
  pretty: {
    title: 'Service Down',
    message:
      '<b>Service Name: </b>{{service_name}} ({{service_address}}) is currently down.',
  },
  nerdy: {
    title: 'Service Down',
    message:
      '<b>Service Name: </b>{{service_name}} ({{service_address}}) is currently down with error <b>{{heartbeat_message}}</b>',
  },
  recovery: {
    title: 'Service Recovered',
    message: 'Service {{service_name}} is back up!',
  },
};

export { PushoverTemplateMessages, PushoverSchema };
