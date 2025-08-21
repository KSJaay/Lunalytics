import Discord from './discord.js';
import HomeAssistant from './homeAssistant.js';
import Pushover from './pushover.js';
import Telegram from './telegram.js';
import Slack from './slack.js';
import Webhook from './webhook.js';

const NotificationServices = {
  Discord,
  HomeAssistant,
  Pushover,
  Telegram,
  Slack,
  Webhook,
};

export default NotificationServices;
