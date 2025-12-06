import axios from 'axios';
import Telegram from '../telegram.js';
import NotificationReplacers from '../../../shared/notifications/replacers/notification.js';
import { TelegramTemplateMessages } from '../../../shared/notifications/telegram.js';

jest.mock('axios');
jest.mock('../../../shared/notifications/replacers/notification.js');

describe('Telegram Notifications', () => {
  let telegram;
  const mockNotification = {
    messageType: 'alert',
    token: 'TEST_TOKEN',
    data: {
      chatId: '123456789',
      disableNotification: false,
      parseMode: 'MarkdownV2',
      protectContent: true,
    },
    payload: 'Payload text',
  };

  const mockMonitor = { name: 'Test Monitor' };
  const mockHeartbeat = { status: 'up' };

  beforeEach(() => {
    telegram = new Telegram();

    // Mock NotificationReplacers to return predictable text
    NotificationReplacers.mockImplementation((message) => {
      if (message === TelegramTemplateMessages.recovery) {
        return message; // return the real recovery template
      }
      return `Processed: ${message}`;
    });

    axios.get.mockClear();
  });

  it('should send notification successfully', async () => {
    axios.get.mockResolvedValue({ status: 200 });

    const result = await telegram.send(mockNotification, mockMonitor, mockHeartbeat);

    expect(NotificationReplacers).toHaveBeenCalledWith(
      TelegramTemplateMessages.alert || mockNotification.payload,
      mockMonitor,
      mockHeartbeat,
      true
    );

    const escapedText = 'Processed: Payload text'.replace(
      /([_*[\]()~`>#+\-=|{}.!\\])/g,
      '\\$1'
    );

    expect(axios.get).toHaveBeenCalledWith(
      `https://api.telegram.org/bot${mockNotification.token}/sendMessage`,
      {
        params: {
          text: escapedText,
          chat_id: mockNotification.data.chatId,
          disable_notification: false,
          parse_mode: 'MarkdownV2',
          protect_content: true,
        },
      }
    );

    expect(result).toEqual(telegram.success);
  });

  it('should handle errors in send', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    await expect(
      telegram.send(mockNotification, mockMonitor, mockHeartbeat)
    ).rejects.toThrow(Error);
  });

  it('should send test notification successfully', async () => {
    axios.get.mockResolvedValue({ status: 200 });

    const result = await telegram.test(mockNotification);

    expect(axios.get).toHaveBeenCalledWith(
      `https://api.telegram.org/bot${mockNotification.token}/sendMessage`,
      {
        params: {
          text: 'This is a test message from Lunalytics',
          chat_id: mockNotification.data.chatId,
          disable_notification: false,
          parse_mode: 'MarkdownV2',
          protect_content: true,
        },
      }
    );

    expect(result).toEqual(telegram.success);
  });

  it('should handle errors in test', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    await expect(telegram.test(mockNotification)).rejects.toThrow(Error);
  });

  it('should send recovery notification successfully', async () => {
    axios.get.mockResolvedValue({ status: 200 });

    const result = await telegram.sendRecovery(mockNotification, mockMonitor, mockHeartbeat);

    expect(NotificationReplacers).toHaveBeenCalledWith(
      TelegramTemplateMessages.recovery,
      mockMonitor,
      mockHeartbeat,
      true
    );

    // Escape the actual recovery template
    const escapedText = TelegramTemplateMessages.recovery.replace(
      /([_*[\]()~`>#+\-=|{}.!\\])/g,
      '\\$1'
    );

    expect(axios.get).toHaveBeenCalledWith(
      `https://api.telegram.org/bot${mockNotification.token}/sendMessage`,
      {
        params: {
          text: escapedText,
          chat_id: mockNotification.data.chatId,
          disable_notification: false,
          parse_mode: 'MarkdownV2',
          protect_content: true,
        },
      }
    );

    expect(result).toEqual(telegram.success);
  });

  it('should handle errors in sendRecovery', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    await expect(
      telegram.sendRecovery(mockNotification, mockMonitor, mockHeartbeat)
    ).rejects.toThrow(Error);
  });
});
