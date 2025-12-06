import axios from 'axios';
import Slack from '../slack.js';
import NotificationReplacers from '../../../shared/notifications/replacers/notification.js';
import { checkObjectAgainstSchema } from '../../../shared/utils/schema.js';
import { SlackTemplateMessages } from '../../../shared/notifications/slack.js';

jest.mock('axios');
jest.mock('../../../shared/notifications/replacers/notification.js');
jest.mock('../../../shared/utils/schema.js');

describe('Slack Notifications', () => {
  let slack;
  const mockNotification = {
    messageType: 'alert',
    token: 'https://hooks.slack.com/services/TOKEN',
    text: 'Alert text',
    channel: '#general',
    username: 'Lunalytics Bot',
    payload: { text: 'payload' },
  };
  const mockMonitor = { name: 'Test Monitor' };
  const mockHeartbeat = { status: 'up' };

  beforeEach(() => {
    slack = new Slack();
    NotificationReplacers.mockImplementation(() => ({
      color: '#36a64f',
      blocks: [
        {
          type: 'section',
          text: 'Processed block', // <-- string, not object
        },
      ],
    }));
    checkObjectAgainstSchema.mockReturnValue(true);
    axios.post.mockClear();
  });

  it('should send notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const result = await slack.send(mockNotification, mockMonitor, mockHeartbeat);

    expect(NotificationReplacers).toHaveBeenCalledWith(
      SlackTemplateMessages.alert || mockNotification.payload,
      mockMonitor,
      mockHeartbeat
    );
    expect(checkObjectAgainstSchema).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(mockNotification.token, {
      text: mockNotification.text,
      channel: mockNotification.channel,
      username: mockNotification.username,
      attachments: [
        {
          color: '#36a64f',
          blocks: [
            { type: 'section', text: 'Processed block' },
          ],
        },
      ],
    });
    expect(result).toEqual(slack.success);
  });

  it('should handle errors in send', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));
    await expect(slack.send(mockNotification, mockMonitor, mockHeartbeat)).rejects.toThrow(Error);
  });

  it('should handle errors in test', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));
    await expect(slack.test(mockNotification)).rejects.toThrow(Error);
  });

  it('should send recovery notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const result = await slack.sendRecovery(mockNotification, mockMonitor, mockHeartbeat);

    expect(NotificationReplacers).toHaveBeenCalledWith(
      SlackTemplateMessages.recovery,
      mockMonitor,
      mockHeartbeat
    );
    expect(axios.post).toHaveBeenCalledWith(mockNotification.token, {
      text: mockNotification.text,
      channel: mockNotification.channel,
      username: mockNotification.username,
      attachments: [
        {
          color: '#36a64f',
          blocks: [
            { type: 'section', text: 'Processed block' },
          ],
        },
      ],
    });
    expect(result).toEqual(slack.success);
  });

  it('should handle errors in sendRecovery', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));
    await expect(slack.sendRecovery(mockNotification, mockMonitor, mockHeartbeat)).rejects.toThrow(Error);
  });

  it('validateSlackBlocks should fail with empty blocks', () => {
    const result = slack.validateSlackBlocks([]);
    expect(result).toBe(false);
  });

  it('validateSlackBlocks should fail if section has no text or fields', () => {
    const result = slack.validateSlackBlocks([{ type: 'section', text: '' }]);
    expect(result).toBe(false);
  });

  it('validateSlackBlocks should fail if fields exceed 10', () => {
    const blocks = [{ type: 'section', fields: Array(11).fill('field') }];
    expect(slack.validateSlackBlocks(blocks)).toBe(false);
  });

  it('validateSlackBlocks should pass with valid blocks', () => {
    const blocks = [{ type: 'section', text: 'Valid text' }];
    expect(slack.validateSlackBlocks(blocks)).toBe(true);
  });
});
