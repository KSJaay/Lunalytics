vi.mock('axios');
vi.mock('../../../shared/notifications/replacers/notification.js');
vi.mock('../../../shared/notifications/slack.js', () => ({
  SlackTemplateMessages: { alert: { blocks: [] }, recovery: { blocks: [] } },
  SlackSchema: {},
}));
vi.mock('../../../shared/utils/schema.js', () => ({
  checkObjectAgainstSchema: vi.fn(() => true),
}));

import Slack from '../../../server/notifications/slack.js';
import NotificationReplacers from '../../../shared/notifications/replacers/notification.js';
import axios from 'axios';
import { SlackTemplateMessages } from '../../../shared/notifications/slack.js';
import { checkObjectAgainstSchema } from '../../../shared/utils/schema.js';

describe('Slack Notifications', () => {
  let slack;
  const mockNotification = {
    messageType: 'alert',
    token: 'https://slack.com/api',
    text: 'Test text',
    channel: '#test',
    username: 'Lunalytics',
    payload: {
      blocks: [
        { type: 'section', text: { type: 'mrkdwn', text: 'original msg' } },
      ],
    },
  };
  const mockMonitor = { name: 'Test Monitor' };
  const mockHeartbeat = { status: 'up' };

  beforeEach(() => {
    slack = new Slack();
    NotificationReplacers.mockImplementation(
      (template, monitor, heartbeat) => ({
        color: '#36a64f',
        blocks: [{ type: 'section', text: { type: 'mrkdwn', text: 'msg' } }],
      })
    );
    axios.post.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should send notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const result = await slack.send(
      mockNotification,
      mockMonitor,
      mockHeartbeat
    );

    expect(NotificationReplacers).toHaveBeenCalledWith(
      SlackTemplateMessages[mockNotification.messageType] ||
        mockNotification.payload,
      mockMonitor,
      mockHeartbeat
    );
    expect(checkObjectAgainstSchema).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(
      mockNotification.token,
      expect.objectContaining({ attachments: [expect.any(Object)] })
    );
    expect(result).toEqual(slack.success);
  });

  it('should handle errors in send', async () => {
    const handleErrorSpy = vi.spyOn(slack, 'handleError');
    axios.post.mockRejectedValue(new Error('Network Error'));
    await slack
      .send(mockNotification, mockMonitor, mockHeartbeat)
      .catch(() => {});
    expect(handleErrorSpy).toHaveBeenCalled();
  });

  it('should send test notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    const result = await slack.test(mockNotification);
    expect(axios.post).toHaveBeenCalledWith(
      mockNotification.token,
      expect.objectContaining({ attachments: [expect.any(Object)] })
    );
    expect(result).toEqual(slack.success);
  });

  it('should handle errors in test', async () => {
    const handleErrorSpy = vi.spyOn(slack, 'handleError');
    axios.post.mockRejectedValue(new Error('Network Error'));
    await slack.test(mockNotification).catch(() => {});
    expect(handleErrorSpy).toHaveBeenCalled();
  });

  it('should send recovery notification successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    const result = await slack.sendRecovery(
      mockNotification,
      mockMonitor,
      mockHeartbeat
    );
    expect(NotificationReplacers).toHaveBeenCalledWith(
      SlackTemplateMessages.recovery,
      mockMonitor,
      mockHeartbeat
    );
    expect(axios.post).toHaveBeenCalledWith(
      mockNotification.token,
      expect.objectContaining({ attachments: [expect.any(Object)] })
    );
    expect(result).toEqual(slack.success);
  });

  it('should handle errors in sendRecovery', async () => {
    const handleErrorSpy = vi.spyOn(slack, 'handleError');
    axios.post.mockRejectedValue(new Error('Network Error'));
    await slack
      .sendRecovery(mockNotification, mockMonitor, mockHeartbeat)
      .catch(() => {});
    expect(handleErrorSpy).toHaveBeenCalled();
  });
});
