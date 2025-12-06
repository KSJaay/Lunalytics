import axios from 'axios';
import Webhook from '../webhook.js';
import NotificationReplacers from '../../../shared/notifications/replacers/notification.js';
import { WebhookTemplateMessages } from '../../../shared/notifications/webhook.js';

jest.mock('axios');
jest.mock('../../../shared/notifications/replacers/notification.js');

// Mock FormData for Node environment
global.FormData = class {
  constructor() {
    this.data = {};
    this.getHeaders = jest.fn(() => ({ 'content-type': 'multipart/form-data' }));
  }
  append(key, value) {
    this.data[key] = value;
  }
};

// Mock WebhookTemplateMessages for predictable test output
jest.mock('../../../shared/notifications/webhook.js', () => ({
  WebhookTemplateMessages: {
    alert: { text: 'Alert template' },
    recovery: { title: 'Recovery template', time: '{{date}}' },
  },
}));

describe('Webhook Notifications', () => {
  let webhook;
  const mockNotification = {
    messageType: 'alert',
    token: 'TEST_TOKEN',
    payload: { text: 'Payload text' },
    requestType: 'json',
    customHeaders: { 'X-Custom-Header': 'value' },
  };

  const mockMonitor = { name: 'Test Monitor' };
  const mockHeartbeat = { status: 'up' };

  beforeEach(() => {
    webhook = new Webhook();

    NotificationReplacers.mockImplementation((message) => `Processed: ${JSON.stringify(message)}`);

    axios.post.mockClear();
  });

  it('should send notification successfully with JSON', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const result = await webhook.send(mockNotification, mockMonitor, mockHeartbeat);

    expect(NotificationReplacers).toHaveBeenCalledWith(
      WebhookTemplateMessages.alert || mockNotification.payload,
      mockMonitor,
      mockHeartbeat
    );

    expect(axios.post).toHaveBeenCalledWith(
      mockNotification.token,
      'Processed: {"text":"Alert template"}',
      { headers: { 'X-Custom-Header': 'value' } }
    );

    expect(result).toEqual(webhook.success);
  });

  it('should send notification successfully with form-data', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const formNotification = { ...mockNotification, requestType: 'form-data' };
    const result = await webhook.send(formNotification, mockMonitor, mockHeartbeat);

    const formInstance = axios.post.mock.calls[0][1];
    const headers = axios.post.mock.calls[0][2].headers;

    expect(headers['content-type']).toContain('multipart/form-data');
    expect(formInstance.data).toBeDefined();
    expect(result).toEqual(webhook.success);
  });

  it('should handle errors in send', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));

    await expect(webhook.send(mockNotification, mockMonitor, mockHeartbeat)).rejects.toThrow(Error);
  });

  it('should send test notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const result = await webhook.test(mockNotification);

    expect(axios.post).toHaveBeenCalledWith(mockNotification.token, {
      message: 'This is a test message from Lunalytics',
    });

    expect(result).toEqual(webhook.success);
  });

  it('should handle errors in test', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));

    await expect(webhook.test(mockNotification)).rejects.toThrow(Error);
  });

  it('should send recovery notification successfully with JSON', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const result = await webhook.sendRecovery(mockNotification, mockMonitor, mockHeartbeat);

    expect(NotificationReplacers).toHaveBeenCalledWith(
      WebhookTemplateMessages.recovery,
      mockMonitor,
      mockHeartbeat
    );

    expect(axios.post).toHaveBeenCalledWith(
      mockNotification.token,
      'Processed: {"title":"Recovery template","time":"{{date}}"}',
      { headers: { 'X-Custom-Header': 'value' } }
    );

    expect(result).toEqual(webhook.success);
  });

  it('should send recovery notification successfully with form-data', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const formNotification = { ...mockNotification, requestType: 'form-data' };
    const result = await webhook.sendRecovery(formNotification, mockMonitor, mockHeartbeat);

    const headers = axios.post.mock.calls[0][2].headers;
    expect(headers['content-type']).toContain('multipart/form-data');

    expect(result).toEqual(webhook.success);
  });

  it('should handle errors in sendRecovery', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));

    await expect(webhook.sendRecovery(mockNotification, mockMonitor, mockHeartbeat)).rejects.toThrow(Error);
  });
});
