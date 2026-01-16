import Apprise from './apprise.js';
import Discord from './discord.js';
import Email from './email.js';
import HomeAssistant from './homeAssistant.js';
import Pushover from './pushover.js';
import Telegram from './telegram.js';
import Slack from './slack.js';
import Webhook from './webhook.js';

const NotificationServices = {
  Apprise,
  Discord,
  Email,
  HomeAssistant,
  Pushover,
  Telegram,
  Slack,
  Webhook,
};

export default NotificationServices;
