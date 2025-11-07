import { DiscordTemplateMessages } from './discord';
import { EmailTemplateMessages } from './email';
import { HomeAssistantTemplateMessages } from './homeAssistant';
import { PushoverTemplateMessages } from './pushover';
import { SlackTemplateMessages } from './slack';
import { TelegramTemplateMessages } from './telegram';
import { WebhookTemplateMessages } from './webhook';

const NotificationsTemplates = {
  Discord: DiscordTemplateMessages,
  Email: EmailTemplateMessages,
  HomeAssistant: HomeAssistantTemplateMessages,
  Pushover: PushoverTemplateMessages,
  Slack: SlackTemplateMessages,
  Telegram: TelegramTemplateMessages,
  Webhook: WebhookTemplateMessages,
};

export default NotificationsTemplates;
