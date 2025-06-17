import Discord from './discord.js';
import Telegram from './telegram.js';
import Slack from './slack.js';
import Webhook from './webhook.js';
import HomeAssistant from './homeAssistant.js';

const NotificationServices = {
  Discord,
  Telegram,
  Slack,
  Webhook,
  HomeAssistant,
};

export default NotificationServices;
