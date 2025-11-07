import Discord from './discord.js';
import Email from './email.js';
import HomeAssistant from './homeAssistant.js';
import Pushover from './pushover.js';
import Slack from './slack.js';
import Telegram from './telegram.js';
import Webhook from './webhook.js';

const NotificationValidators = {
  Discord,
  Email,
  HomeAssistant,
  Pushover,
  Slack,
  Telegram,
  Webhook,
};

export default NotificationValidators;
