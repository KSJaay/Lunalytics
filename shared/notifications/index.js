import { DiscordTemplateMessages } from './discord';
import { SlackTemplateMessages } from './slack';
import { TelegramTemplateMessages } from './telegram';
import { WebhookTemplateMessages } from './webhook';

const NotificationsTemplates = {
  Discord: DiscordTemplateMessages,
  Slack: SlackTemplateMessages,
  Telegram: TelegramTemplateMessages,
  Webhook: WebhookTemplateMessages,
};

export default NotificationsTemplates;
