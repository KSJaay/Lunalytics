import axios from 'axios';
import HomeAssistant from '../../../server/notifications/homeAssistant.js';
import NotificationReplacers from '../../../shared/notifications/replacers/notification.js';
import { HomeAssistantTemplateMessages } from '../../../shared/notifications/homeAssistant.js';

vi.mock('axios');
vi.mock('../../../shared/notifications/replacers/notification.js');
vi.mock('../../../shared/notifications/homeAssistant.js', () => ({
  HomeAssistantTemplateMessages: {
    alert: { message: 'alert' },
    recovery: { message: 'recovery' },
  },
}));

describe.skip('HomeAssistant Notifications', () => {
  let homeAssistant;
  const mockNotification = {
    messageType: 'alert',
    token: 'token',
    data: {
      homeAssistantUrl: 'http://localhost:8123',
      homeAssistantNotificationService: 'notify_service',
    },
    payload: { message: 'original payload' },
  };
  const mockMonitor = { name: 'Test Monitor' };
  const mockHeartbeat = { status: 'up' };

  beforeEach(() => {
    homeAssistant = new HomeAssistant();
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
    await homeAssistant.send(mockNotification, mockMonitor, mockHeartbeat);

    expect(NotificationReplacers).toHaveBeenCalledWith(
      HomeAssistantTemplateMessages[mockNotification.messageType] ||
        mockNotification.payload,
      mockMonitor,
      mockHeartbeat
    );

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8123/api/services/notify/notify_service',
      { message: 'Processed message', title: 'Processed title' },
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it('should handle errors in send', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));
    try {
      await homeAssistant.send(mockNotification, mockMonitor, mockHeartbeat);
    } catch (error) {
      expect(error.message).toBe('Network Error');
    }
  });

  it('should send test notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    await homeAssistant.test(mockNotification);
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8123/api/services/notify/notify_service',
      expect.objectContaining({
        message: expect.any(String),
        title: expect.any(String),
      }),
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it('should handle errors in test', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));

    try {
      await homeAssistant.test(mockNotification);
    } catch (error) {
      expect(error.message).toBe('Error: Network Error');
    }
  });

  it('should send recovery notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    await homeAssistant.sendRecovery(
      mockNotification,
      mockMonitor,
      mockHeartbeat
    );
    expect(NotificationReplacers).toHaveBeenCalledWith(
      HomeAssistantTemplateMessages.recovery,
      mockMonitor,
      mockHeartbeat
    );
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8123/api/services/notify/notify_service',
      { message: 'Processed message', title: 'Processed title' },
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it('should handle errors in sendRecovery', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));

    try {
      await homeAssistant.sendRecovery(
        mockNotification,
        mockMonitor,
        mockHeartbeat
      );
    } catch (error) {
      expect(error.message).toBe('Error: Network Error');
    }
  });
});
