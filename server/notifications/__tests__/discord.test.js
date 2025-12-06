import axios from 'axios';
import Discord from '../discord.js';
import NotificationReplacers from '../../../shared/notifications/replacers/notification.js';
import { DiscordTemplateMessages } from '../../../shared/notifications/discord.js';

jest.mock('axios');
jest.mock('../../../shared/notifications/replacers/notification.js');

describe('Discord Notifications', () => {
  let discord;
  const mockNotification = {
    messageType: 'alert',
    token: 'https://discord.com/api/webhooks/test-token',
    payload: { content: 'original payload' },
  };

  const mockMonitor = { name: 'Test Monitor' };
  const mockHeartbeat = { status: 'up' };

  beforeEach(() => {
    discord = new Discord();
    NotificationReplacers.mockImplementation((template, monitor, heartbeat) => ({
      content: 'Processed content',
      title: 'Processed title',
    }));
    axios.post.mockClear();
  });

  it('should send notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const result = await discord.send(mockNotification, mockMonitor, mockHeartbeat);

    expect(NotificationReplacers).toHaveBeenCalledWith(
      DiscordTemplateMessages[mockNotification.messageType] || mockNotification.payload,
      mockMonitor,
      mockHeartbeat
    );

    expect(axios.post).toHaveBeenCalledWith(mockNotification.token, {
      content: 'Processed content',
      title: 'Processed title',
    });

    expect(result).toEqual(discord.success);
  });

  it('should handle errors in send', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));

    await expect(discord.send(mockNotification, mockMonitor, mockHeartbeat))
      .rejects.toThrow('Error: Network Error');
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
    axios.post.mockRejectedValue(new Error('Network Error'));

    await expect(discord.test(mockNotification)).rejects.toThrow('Error: Network Error');
  });

  it('should send recovery notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const result = await discord.sendRecovery(mockNotification, mockMonitor, mockHeartbeat);

    expect(NotificationReplacers).toHaveBeenCalledWith(
      DiscordTemplateMessages.recovery,
      mockMonitor,
      mockHeartbeat
    );

    expect(axios.post).toHaveBeenCalledWith(mockNotification.token, {
      content: 'Processed content',
      title: 'Processed title',
    });

    expect(result).toEqual(discord.success);
  });

  it('should handle errors in sendRecovery', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));

    await expect(discord.sendRecovery(mockNotification, mockMonitor, mockHeartbeat))
      .rejects.toThrow('Error: Network Error');
  });
});
