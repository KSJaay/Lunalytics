vi.mock('axios');
vi.mock('../../../shared/notifications/replacers/notification.js');
vi.mock('../../../shared/notifications/discord.js', () => ({
  DiscordTemplateMessages: {
    alert: { content: 'alert' },
    recovery: { content: 'recovery' },
  },
}));

import Discord from '../../../server/notifications/discord.js';
import NotificationReplacers from '../../../shared/notifications/replacers/notification.js';
import axios from 'axios';
import { DiscordTemplateMessages } from '../../../shared/notifications/discord.js';

describe('Discord Notifications', () => {
  let discord;
  const mockNotification = {
    messageType: 'alert',
    token: 'https://discord.com/api',
    payload: { content: 'original payload' },
  };
  const mockMonitor = { name: 'Test Monitor' };
  const mockHeartbeat = { status: 'up' };

  beforeEach(() => {
    discord = new Discord();
    NotificationReplacers.mockImplementation(
      (template, monitor, heartbeat) => ({
        content: 'Processed content',
      })
    );
    axios.post.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should send notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    const result = await discord.send(
      mockNotification,
      mockMonitor,
      mockHeartbeat
    );
    expect(NotificationReplacers).toHaveBeenCalledWith(
      DiscordTemplateMessages[mockNotification.messageType] ||
        mockNotification.payload,
      mockMonitor,
      mockHeartbeat
    );
    expect(axios.post).toHaveBeenCalledWith(mockNotification.token, {
      content: 'Processed content',
    });
    expect(result).toEqual(discord.success);
  });

  it('should handle errors in send', async () => {
    const handleErrorSpy = vi.spyOn(discord, 'handleError');
    axios.post.mockRejectedValue(new Error('Network Error'));
    await discord
      .send(mockNotification, mockMonitor, mockHeartbeat)
      .catch(() => {});
    expect(handleErrorSpy).toHaveBeenCalled();
  });

  it('should send test notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    const result = await discord.test(mockNotification);
    expect(axios.post).toHaveBeenCalledWith(mockNotification.token, {
      content: 'This is a test message',
    });
    expect(result).toEqual(discord.success);
  });

  it('should handle errors in test', async () => {
    const handleErrorSpy = vi.spyOn(discord, 'handleError');
    axios.post.mockRejectedValue(new Error('Network Error'));
    await discord.test(mockNotification).catch(() => {});
    expect(handleErrorSpy).toHaveBeenCalled();
  });

  it('should send recovery notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    const result = await discord.sendRecovery(
      mockNotification,
      mockMonitor,
      mockHeartbeat
    );
    expect(NotificationReplacers).toHaveBeenCalledWith(
      DiscordTemplateMessages.recovery,
      mockMonitor,
      mockHeartbeat
    );
    expect(axios.post).toHaveBeenCalledWith(mockNotification.token, {
      content: 'Processed content',
    });
    expect(result).toEqual(discord.success);
  });

  it('should handle errors in sendRecovery', async () => {
    const handleErrorSpy = vi.spyOn(discord, 'handleError');
    axios.post.mockRejectedValue(new Error('Network Error'));
    await discord
      .sendRecovery(mockNotification, mockMonitor, mockHeartbeat)
      .catch(() => {});
    expect(handleErrorSpy).toHaveBeenCalled();
  });
});
