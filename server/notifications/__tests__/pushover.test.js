import axios from 'axios';
import Pushover from '../pushover.js';
import NotificationReplacers from '../../../shared/notifications/replacers/notification.js';
import config from '../../../server/utils/config.js';
import { PushoverTemplateMessages } from '../../../shared/notifications/pushover.js';

jest.mock('axios');
jest.mock('../../../shared/notifications/replacers/notification.js');
jest.mock('../../../server/utils/config.js');

describe('Pushover Notifications', () => {
  let pushover;
  const mockNotification = {
    messageType: 'alert',
    token: 'test-token',
    data: {
      userKey: 'user-key',
      priority: 1,
      device: 'device-1',
      ttl: 1200,
    },
    payload: { text: 'payload' },
  };
  const mockMonitor = { name: 'Test Monitor' };
  const mockHeartbeat = { status: 'up' };

  beforeEach(() => {
    pushover = new Pushover();
    NotificationReplacers.mockImplementation(() => ({
      title: 'Processed title',
      message: 'Processed message',
    }));
    axios.post.mockClear();
    config.get.mockReturnValue('https://lunalytics.xyz');
  });

  it('should construct correct config data', () => {
    const data = pushover.getConfig(mockNotification);
    expect(data).toEqual({
      token: 'test-token',
      user: 'user-key',
      retry: '30',
      expire: '3600',
      html: '1',
      priority: 1,
      url: 'https://lunalytics.xyz/home',
      url_title: 'Open Dashboard',
      device: 'device-1',
      ttl: 1200,
    });
  });

  it('should send notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const result = await pushover.send(mockNotification, mockMonitor, mockHeartbeat);

    expect(NotificationReplacers).toHaveBeenCalledWith(
      PushoverTemplateMessages.alert || mockNotification.payload,
      mockMonitor,
      mockHeartbeat
    );

    expect(axios.post).toHaveBeenCalledWith(
      'https://api.pushover.net/1/messages.json',
      expect.objectContaining({
        token: 'test-token',
        user: 'user-key',
        title: 'Processed title',
        message: 'Processed message',
      })
    );

    expect(result).toEqual(pushover.success);
  });

  it('should handle errors in send', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));
    await expect(pushover.send(mockNotification, mockMonitor, mockHeartbeat)).rejects.toThrow(Error);
  });

  it('should send recovery notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const result = await pushover.sendRecovery(mockNotification, mockMonitor, mockHeartbeat);

    expect(NotificationReplacers).toHaveBeenCalledWith(
      PushoverTemplateMessages.recovery,
      mockMonitor,
      mockHeartbeat
    );

    expect(axios.post).toHaveBeenCalledWith(
      'https://api.pushover.net/1/messages.json',
      expect.objectContaining({
        token: 'test-token',
        user: 'user-key',
        title: 'Processed title',
        message: 'Processed message',
      })
    );

    expect(result).toEqual(pushover.success);
  });

  it('should handle errors in sendRecovery', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));
    await expect(pushover.sendRecovery(mockNotification, mockMonitor, mockHeartbeat)).rejects.toThrow(Error);
  });

  it('should send test notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const result = await pushover.test(mockNotification);

    expect(axios.post).toHaveBeenCalledWith(
      'https://api.pushover.net/1/messages.json',
      expect.objectContaining({
        token: 'test-token',
        user: 'user-key',
        title: 'Lunalytics Test Message',
        message: 'This is a test message from Lunalytics',
      })
    );

    expect(result).toEqual(pushover.success);
  });

  it('should handle errors in test', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));
    await expect(pushover.test(mockNotification)).rejects.toThrow(Error);
  });
});
