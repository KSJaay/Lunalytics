import NotificationServices from '../../../server/notifications/index.js';
import Apprise from '../../../server/notifications/apprise.js';
import Discord from '../../../server/notifications/discord.js';
import Email from '../../../server/notifications/email.js';
import HomeAssistant from '../../../server/notifications/homeAssistant.js';
import Pushover from '../../../server/notifications/pushover.js';
import Telegram from '../../../server/notifications/telegram.js';
import Slack from '../../../server/notifications/slack.js';
import Webhook from '../../../server/notifications/webhook.js';

describe('NotificationServices index', () => {
  it('should export all notification service classes', () => {
    expect(NotificationServices).toHaveProperty('Apprise', Apprise);
    expect(NotificationServices).toHaveProperty('Discord', Discord);
    expect(NotificationServices).toHaveProperty('Email', Email);
    expect(NotificationServices).toHaveProperty('HomeAssistant', HomeAssistant);
    expect(NotificationServices).toHaveProperty('Pushover', Pushover);
    expect(NotificationServices).toHaveProperty('Telegram', Telegram);
    expect(NotificationServices).toHaveProperty('Slack', Slack);
    expect(NotificationServices).toHaveProperty('Webhook', Webhook);
  });

  it('should contain exactly 8 services', () => {
    expect(Object.keys(NotificationServices)).toHaveLength(8);
  });
});
