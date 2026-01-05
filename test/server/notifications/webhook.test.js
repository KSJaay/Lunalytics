vi.mock('axios');
vi.mock('../../../shared/notifications/replacers/notification.js');
vi.mock('../../../shared/notifications/webhook.js', () => ({
  WebhookTemplateMessages: {
    alert: { message: 'alert' },
    recovery: { message: 'recovery' },
  },
}));

import Webhook from '../../../server/notifications/webhook.js';
import NotificationReplacers from '../../../shared/notifications/replacers/notification.js';
import axios from 'axios';
import { WebhookTemplateMessages } from '../../../shared/notifications/webhook.js';

describe('Webhook Notifications', () => {
  let webhook;
  const mockNotification = {
    messageType: 'alert',
    token: 'https://webhook.site/api',
    payload: { message: 'original payload' },
    requestType: undefined,
    customHeaders: undefined,
    data: {},
  };
  const mockMonitor = { name: 'Test Monitor' };
  const mockHeartbeat = { status: 'up' };

  beforeEach(() => {
    webhook = new Webhook();
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
    const result = await webhook.send(
      mockNotification,
      mockMonitor,
      mockHeartbeat
    );
    expect(NotificationReplacers).toHaveBeenCalledWith(
      WebhookTemplateMessages[mockNotification.messageType] ||
        mockNotification.payload,
      mockMonitor,
      mockHeartbeat
    );
    expect(axios.post).toHaveBeenCalledWith(
      mockNotification.token,
      expect.objectContaining({
        message: 'Processed message',
        title: 'Processed title',
      }),
      expect.any(Object)
    );
    expect(result).toEqual(webhook.success);
  });

  it('should handle errors in send', async () => {
    const handleErrorSpy = vi.spyOn(webhook, 'handleError');
    axios.post.mockRejectedValue(new Error('Network Error'));
    await webhook
      .send(mockNotification, mockMonitor, mockHeartbeat)
      .catch(() => {});
    expect(handleErrorSpy).toHaveBeenCalled();
  });

  it('should send test notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    const result = await webhook.test(mockNotification);
    expect(axios.post).toHaveBeenCalledWith(
      mockNotification.token,
      expect.objectContaining({ message: expect.any(String) })
    );
    expect(result).toEqual(webhook.success);
  });

  it('should handle errors in test', async () => {
    const handleErrorSpy = vi.spyOn(webhook, 'handleError');
    axios.post.mockRejectedValue(new Error('Network Error'));
    await webhook.test(mockNotification).catch(() => {});
    expect(handleErrorSpy).toHaveBeenCalled();
  });

  it('should send recovery notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    const result = await webhook.sendRecovery(
      mockNotification,
      mockMonitor,
      mockHeartbeat
    );
    expect(NotificationReplacers).toHaveBeenCalledWith(
      WebhookTemplateMessages.recovery,
      mockMonitor,
      mockHeartbeat
    );
    expect(axios.post).toHaveBeenCalledWith(
      mockNotification.token,
      expect.objectContaining({
        message: 'Processed message',
        title: 'Processed title',
      }),
      expect.any(Object)
    );
    expect(result).toEqual(webhook.success);
  });

  it('should handle errors in sendRecovery', async () => {
    const handleErrorSpy = vi.spyOn(webhook, 'handleError');
    axios.post.mockRejectedValue(new Error('Network Error'));
    await webhook
      .sendRecovery(mockNotification, mockMonitor, mockHeartbeat)
      .catch(() => {});
    expect(handleErrorSpy).toHaveBeenCalled();
  });
});
