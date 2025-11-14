const AppriseSchema = {};

const AppriseTemplateMessages = {
  basic: {
    title: 'Triggered: Service {{service_name}} is currently down!',
  },
  pretty: {
    title: 'Triggered: Service {{service_name}} is currently down!',
    body: '**Service Name**\n{{service_name}}\n\n**Service Address**\n{{service_address}}\n\n**Latency**\n{{heartbeat_latency}} ms\n\n**Error**\n{{heartbeat_message}}',
  },
  nerdy: {
    title: 'Triggered: Service {{service_name}} is currently down!',
    body: '**Service**\n```{{service_parsed_json}}```\n\n**Heartbeat**\n```{{heartbeat_parsed_json}}```',
  },
  recovery: {
    title: 'Service {{service_name}} is back up!',
  },
};

export { AppriseSchema, AppriseTemplateMessages };
