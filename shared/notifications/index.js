import { DiscordTemplateMessages } from './discord';
import { SlackTemplateMessages } from './slack';
import { TelegramTemplateMessages } from './telegram';
import { WebhookTemplateMessages } from './webhook';
import { HomeAssistantTemplateMessages } from './homeAssistant';

const NotificationsTemplates = {
  Discord: DiscordTemplateMessages,
  Slack: SlackTemplateMessages,
  Telegram: TelegramTemplateMessages,
  Webhook: WebhookTemplateMessages,
  HomeAssistant: HomeAssistantTemplateMessages,
};

export default NotificationsTemplates;
