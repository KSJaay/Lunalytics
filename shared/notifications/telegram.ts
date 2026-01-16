const TelegramTemplateMessages = {
  basic: '*Triggered: Service {{service_name}} is currently down!*',
  pretty:
    '*Triggered: Service {{service_name}} is currently down!*\n\n*Service Name*\n{{service_name}}\n\n*Service Address*\n{{service_address}}\n\n*Latency*\n{{heartbeat_latency}} ms\n\n*Error*\n{{heartbeat_message}}',
  nerdy:
    '*Triggered: Service {{service_name}} is currently down!*\n\n*Service*\n```{{service_json}}```\n\n*Heartbeat*\n```{{heartbeat_json}}```',
  recovery: '*Service {{service_name}} is back up!*',
};

export { TelegramTemplateMessages };
