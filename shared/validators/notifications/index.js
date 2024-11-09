import Discord from './discord.js';
import Slack from './slack.js';
import Telegram from './telegram.js';
import Webhook from './webhook.js';

const NotificationValidators = { Discord, Telegram, Slack, Webhook };

export default NotificationValidators;
