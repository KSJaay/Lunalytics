import { AppriseTemplateMessages } from './apprise.js';
import { DiscordTemplateMessages } from './discord.js';
import { EmailTemplateMessages } from './email.js';
import { HomeAssistantTemplateMessages } from './homeAssistant.js';
import { PushoverTemplateMessages } from './pushover.js';
import { SlackTemplateMessages } from './slack.js';
import { TelegramTemplateMessages } from './telegram.js';
import { WebhookTemplateMessages } from './webhook.js';

const NotificationsTemplates = {
  Apprise: AppriseTemplateMessages,
  Discord: DiscordTemplateMessages,
  Email: EmailTemplateMessages,
  HomeAssistant: HomeAssistantTemplateMessages,
  Pushover: PushoverTemplateMessages,
  Slack: SlackTemplateMessages,
  Telegram: TelegramTemplateMessages,
  Webhook: WebhookTemplateMessages,
};

export default NotificationsTemplates;
