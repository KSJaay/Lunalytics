import NotificationServices from '../index.js';
import Apprise from '../apprise.js';
import Discord from '../discord.js';
import Email from '../email.js';
import HomeAssistant from '../homeAssistant.js';
import Pushover from '../pushover.js';
import Telegram from '../telegram.js';
import Slack from '../slack.js';
import Webhook from '../webhook.js';

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
