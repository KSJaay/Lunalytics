vi.mock('axios');
vi.mock('../../../shared/notifications/replacers/notification.js');
vi.mock('../../../shared/notifications/pushover.js', () => ({
  PushoverTemplateMessages: {
    alert: { message: 'alert' },
    recovery: { message: 'recovery' },
  },
}));
vi.mock('../../../server/utils/config.js', () => ({
  default: { get: vi.fn(() => 'https://lunalytics.xyz') },
}));

import Pushover from '../../../server/notifications/pushover.js';
import NotificationReplacers from '../../../shared/notifications/replacers/notification.js';
import axios from 'axios';
import { PushoverTemplateMessages } from '../../../shared/notifications/pushover.js';

describe('Pushover Notifications', () => {
  let pushover;
  const mockNotification = {
    messageType: 'alert',
    token: 'pushover-token',
    data: {
      userKey: 'user-key',
      priority: 1,
      device: 'device1',
      ttl: 60,
    },
    payload: { message: 'original payload' },
  };
  const mockMonitor = { name: 'Test Monitor' };
  const mockHeartbeat = { status: 'up' };

  beforeEach(() => {
    pushover = new Pushover();
    NotificationReplacers.mockImplementation(
      (template, monitor, heartbeat) => ({
        message: 'Processed message',
        title: 'Processed title',
      })
    );
    axios.post.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should send notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    const result = await pushover.send(
      mockNotification,
      mockMonitor,
      mockHeartbeat
    );
    expect(NotificationReplacers).toHaveBeenCalledWith(
      PushoverTemplateMessages[mockNotification.messageType] ||
        mockNotification.payload,
      mockMonitor,
      mockHeartbeat
    );
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.pushover.net/1/messages.json',
      expect.objectContaining({
        message: 'Processed message',
        title: 'Processed title',
      })
    );
    expect(result).toEqual(pushover.success);
  });

  it('should handle errors in send', async () => {
    const handleErrorSpy = vi.spyOn(pushover, 'handleError');
    axios.post.mockRejectedValue(new Error('Network Error'));
    await pushover
      .send(mockNotification, mockMonitor, mockHeartbeat)
      .catch(() => {});
    expect(handleErrorSpy).toHaveBeenCalled();
  });

  it('should send test notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    const result = await pushover.test(mockNotification);
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.pushover.net/1/messages.json',
      expect.objectContaining({
        message: 'This is a test message from Lunalytics',
        title: 'Lunalytics Test Message',
      })
    );
    expect(result).toEqual(pushover.success);
  });

  it('should handle errors in test', async () => {
    const handleErrorSpy = vi.spyOn(pushover, 'handleError');
    axios.post.mockRejectedValue(new Error('Network Error'));
    await pushover.test(mockNotification).catch(() => {});
    expect(handleErrorSpy).toHaveBeenCalled();
  });

  it('should send recovery notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    const result = await pushover.sendRecovery(
      mockNotification,
      mockMonitor,
      mockHeartbeat
    );
    expect(NotificationReplacers).toHaveBeenCalledWith(
      PushoverTemplateMessages.recovery,
      mockMonitor,
      mockHeartbeat
    );
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.pushover.net/1/messages.json',
      expect.objectContaining({
        message: 'Processed message',
        title: 'Processed title',
      })
    );
    expect(result).toEqual(pushover.success);
  });

  it('should handle errors in sendRecovery', async () => {
    const handleErrorSpy = vi.spyOn(pushover, 'handleError');
    axios.post.mockRejectedValue(new Error('Network Error'));
    await pushover
      .sendRecovery(mockNotification, mockMonitor, mockHeartbeat)
      .catch(() => {});
    expect(handleErrorSpy).toHaveBeenCalled();
  });
});
