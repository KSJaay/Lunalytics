const HomeAssistantSchema = {

}

const HomeAssistantTemplateMessages = {
  basic: {
    "title": "Triggered: Service {{service_name}} is currently down!",
    "message": "**Service Name**\n{{service_name}}\n\n**Service Address**\n{{service_address}}\n\n**Latency**\n{{heartbeat_latency}} ms\n\n**Error**\n{{heartbeat_message}}"
  },
  pretty: {
    "title": "Triggered: Service {{service_name}} is currently down!",
    "message": "**Service Name**\n{{service_name}}\n\n**Service Address**\n{{service_address}}\n\n**Latency**\n{{heartbeat_latency}} ms\n\n**Error**\n{{heartbeat_message}}"
  },
  nerdy: {
    "title": "Triggered: Service {{service_name}} is currently down!",
    "message": "**Service Name**\n{{service_name}}\n\n**Service Address**\n{{service_address}}\n\n**Latency**\n{{heartbeat_latency}} ms\n\n**Error**\n{{heartbeat_message}}"
  },
  recovery: {
    "title": "Service {{service_name}} is back up!",
    "message": "**Service Name**\n{{service_name}}\n\n**Service Address**\n{{service_address}}\n\n**Latency**\n{{heartbeat_latency}} ms\n\n**Error**\n{{heartbeat_message}}"
  },
}

export { HomeAssistantTemplateMessages, HomeAssistantSchema };