vi.mock('axios');
vi.mock('../../../shared/notifications/replacers/notification.js');
vi.mock('../../../shared/notifications/telegram.js', () => ({
  TelegramTemplateMessages: { alert: 'alert', recovery: 'recovery' },
}));

import Telegram from '../../../server/notifications/telegram.js';
import NotificationReplacers from '../../../shared/notifications/replacers/notification.js';
import axios from 'axios';
import { TelegramTemplateMessages } from '../../../shared/notifications/telegram.js';

describe('Telegram Notifications', () => {
  let telegram;
  const mockNotification = {
    messageType: 'alert',
    token: 'telegram-token',
    data: {
      chatId: 12345,
      disableNotification: false,
      parseMode: 'MarkdownV2',
      protectContent: false,
    },
    payload: 'original payload',
  };
  const mockMonitor = { name: 'Test Monitor' };
  const mockHeartbeat = { status: 'up' };

  beforeEach(() => {
    telegram = new Telegram();
    NotificationReplacers.mockImplementation(
      (template, monitor, heartbeat, escape) => 'Processed message'
    );
    axios.get.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should send notification successfully', async () => {
    axios.get.mockResolvedValue({ status: 200 });
    const result = await telegram.send(
      mockNotification,
      mockMonitor,
      mockHeartbeat
    );
    expect(NotificationReplacers).toHaveBeenCalledWith(
      TelegramTemplateMessages[mockNotification.messageType] ||
        mockNotification.payload,
      mockMonitor,
      mockHeartbeat,
      true
    );
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://api.telegram.org/bottelegram-token/sendMessage'
      ),
      expect.objectContaining({
        params: expect.objectContaining({
          text: expect.any(String),
          chat_id: 12345,
        }),
      })
    );
    expect(result).toEqual(telegram.success);
  });

  it('should handle errors in send', async () => {
    const handleErrorSpy = vi.spyOn(telegram, 'handleError');
    axios.get.mockRejectedValue(new Error('Network Error'));
    await telegram
      .send(mockNotification, mockMonitor, mockHeartbeat)
      .catch(() => {});
    expect(handleErrorSpy).toHaveBeenCalled();
  });

  it('should send test notification successfully', async () => {
    axios.get.mockResolvedValue({ status: 200 });
    const result = await telegram.test(mockNotification);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://api.telegram.org/bottelegram-token/sendMessage'
      ),
      expect.objectContaining({
        params: expect.objectContaining({
          text: expect.any(String),
          chat_id: 12345,
        }),
      })
    );
    expect(result).toEqual(telegram.success);
  });

  it('should handle errors in test', async () => {
    const handleErrorSpy = vi.spyOn(telegram, 'handleError');
    axios.get.mockRejectedValue(new Error('Network Error'));
    await telegram.test(mockNotification).catch(() => {});
    expect(handleErrorSpy).toHaveBeenCalled();
  });

  it('should send recovery notification successfully', async () => {
    axios.get.mockResolvedValue({ status: 200 });
    const result = await telegram.sendRecovery(
      mockNotification,
      mockMonitor,
      mockHeartbeat
    );
    expect(NotificationReplacers).toHaveBeenCalledWith(
      TelegramTemplateMessages.recovery,
      mockMonitor,
      mockHeartbeat,
      true
    );
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://api.telegram.org/bottelegram-token/sendMessage'
      ),
      expect.objectContaining({
        params: expect.objectContaining({
          text: expect.any(String),
          chat_id: 12345,
        }),
      })
    );
    expect(result).toEqual(telegram.success);
  });

  it('should handle errors in sendRecovery', async () => {
    const handleErrorSpy = vi.spyOn(telegram, 'handleError');
    axios.get.mockRejectedValue(new Error('Network Error'));
    await telegram
      .sendRecovery(mockNotification, mockMonitor, mockHeartbeat)
      .catch(() => {});
    expect(handleErrorSpy).toHaveBeenCalled();
  });
});
