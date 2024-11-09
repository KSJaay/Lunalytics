const WebhookTemplateMessages = {
  basic: {
    title: 'Triggered: Service {{service_name}} is currently down!',
    time: '{{date[YYYY-MM-DDTHH:mm:ssZ[Z]]}}',
  },
  pretty: {
    title: 'Triggered: Service {{service_name}} is currently down!',
    time: '{{date[YYYY-MM-DDTHH:mm:ssZ[Z]]}}',
    service_name: '{{service_name}}',
    service_address: '{{service_address}}',
    heartbeat_latency: '{{heartbeat_latency}}',
    heartbeat_error: '{{heartbeat_message}}',
  },
  nerdy: {
    title: 'Triggered: Service {{service_name}} is currently down!',
    time: '{{date[YYYY-MM-DDTHH:mm:ssZ[Z]]}}',
    service: {
      monitorId: '{{service_monitorId}}',
      name: '{{service_name}}',
      url: '{{service_url}}',
      interval: '{{service_interval}}',
      retryInterval: '{{service_retryInterval}}',
      requestTimeout: '{{service_requestTimeout}}',
      method: '{{service_method}}',
      validStatusCodes: '{{service_validStatusCodes}}',
      email: '{{service_email}}',
      type: '{{service_type}}',
      port: '{{service_port}}',
      address: '{{service_address}}',
    },
    heartbeat: {
      status: '{{heartbeat_status}}',
      latency: '{{heartbeat_latency}}',
      date: '{{heartbeat_date}}',
      isDown: '{{heartbeat_isDown}}',
      message: '{{heartbeat_message}}',
    },
  },
  recovery: {
    title: 'Service {{service_name}} is back up!',
    time: '{{date[YYYY-MM-DDTHH:mm:ssZ[Z]]}}',
  },
};

export { WebhookTemplateMessages };
