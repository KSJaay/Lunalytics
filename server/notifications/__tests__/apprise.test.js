import axios from 'axios';
import Apprise from '../apprise.js';
import NotificationReplacers from '../../../shared/notifications/replacers/notification.js';
import { AppriseTemplateMessages } from '../../../shared/notifications/apprise.js';

jest.mock('axios');
jest.mock('../../../shared/notifications/replacers/notification.js');

describe('Apprise Notifications', () => {
  let apprise;
  const mockNotification = {
    messageType: 'alert',
    token: 'https://example.com/api',
    payload: { text: 'original payload' },
    data: { urls: 'http://test1.com,http://test2.com' },
  };

  const mockMonitor = { name: 'Test Monitor' };
  const mockHeartbeat = { status: 'up' };

  beforeEach(() => {
    apprise = new Apprise();
    NotificationReplacers.mockImplementation((template, monitor, heartbeat) => ({
      title: 'Processed title',
      body: 'Processed body',
    }));
    axios.post.mockClear();
  });

  it('should send notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const result = await apprise.send(mockNotification, mockMonitor, mockHeartbeat);

    expect(NotificationReplacers).toHaveBeenCalledWith(
      AppriseTemplateMessages[mockNotification.messageType] || mockNotification.payload,
      mockMonitor,
      mockHeartbeat
    );

    expect(axios.post).toHaveBeenCalledWith(mockNotification.token, {
      title: 'Processed title',
      body: 'Processed body',
      urls: ['http://test1.com', 'http://test2.com'],
    });

    expect(result).toEqual(apprise.success);
  });

  it('should handle errors in send', async () => {
    const handleErrorSpy = jest.spyOn(apprise, 'handleError');
    axios.post.mockRejectedValue(new Error('Network Error'));

    await apprise.send(mockNotification, mockMonitor, mockHeartbeat).catch(() => {});

    expect(handleErrorSpy).toHaveBeenCalled();
  });

  it('should send test notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const result = await apprise.test(mockNotification);

    expect(axios.post).toHaveBeenCalledWith(mockNotification.token, {
      title: 'This is a test message',
      urls: ['http://test1.com', 'http://test2.com'],
    });

    expect(result).toEqual(apprise.success);
  });

  it('should handle errors in test', async () => {
    const handleErrorSpy = jest.spyOn(apprise, 'handleError');
    axios.post.mockRejectedValue(new Error('Network Error'));

    await apprise.test(mockNotification).catch(() => {});

    expect(handleErrorSpy).toHaveBeenCalled();
  });

  it('should send recovery notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const result = await apprise.sendRecovery(mockNotification, mockMonitor, mockHeartbeat);

    expect(NotificationReplacers).toHaveBeenCalledWith(
      AppriseTemplateMessages.recovery,
      mockMonitor,
      mockHeartbeat
    );

    expect(axios.post).toHaveBeenCalledWith(mockNotification.token, {
      title: 'Processed title',
      body: 'Processed body',
      urls: ['http://test1.com', 'http://test2.com'],
    });

    expect(result).toEqual(apprise.success);
  });

  it('should handle errors in sendRecovery', async () => {
    const handleErrorSpy = jest.spyOn(apprise, 'handleError');
    axios.post.mockRejectedValue(new Error('Network Error'));

    await apprise.sendRecovery(mockNotification, mockMonitor, mockHeartbeat).catch(() => {});

    expect(handleErrorSpy).toHaveBeenCalled();
  });
});
