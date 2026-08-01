import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }));

vi.mock('axios', () => ({
  default: { post: mockPost, get: vi.fn() },
  post: mockPost,
}));

import Slack from '../../../server/notifications/slack.js';

const monitor = { name: 'site', url: 'https://x', interval: 30 } as any;
const heartbeat = { status: 0, message: 'down', latency: 0 } as any;
const baseNotification = {
  token: 'https://slack.test/webhook',
  messageType: 'basic',
  channel: '#alerts',
  username: 'lunalytics',
  text: 'down',
} as any;

describe('server/notifications/slack', () => {
  beforeEach(() => mockPost.mockReset());

  it('send() posts a message with attachments', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const s = new Slack();
    const result = await s.send(baseNotification, monitor, heartbeat);
    expect(result).toBe(s.success);
    expect(mockPost).toHaveBeenCalledTimes(1);
    const body = mockPost.mock.calls[0][1];
    expect(body.channel).toBe('#alerts');
    expect(body.attachments).toBeInstanceOf(Array);
  });

  it('sendRecovery() posts the recovery payload', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const s = new Slack();
    await s.sendRecovery(baseNotification, monitor, heartbeat);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  it('test() posts a fixed test payload', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const s = new Slack();
    await s.test(baseNotification);
    expect(mockPost.mock.calls[0][1].text).toMatch(/test message/i);
  });

  it('validateSlackBlocks rejects empty section blocks', () => {
    const s = new Slack();
    expect(
      s.validateSlackBlocks([{ type: 'section', text: { text: '' } }])
    ).toBe(false);
    expect(
      s.validateSlackBlocks([
        { type: 'section', text: { text: 'has content' } },
      ])
    ).toBe(true);
  });
});
