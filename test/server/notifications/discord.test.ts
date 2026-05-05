import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }));

vi.mock('axios', () => ({
  default: { post: mockPost, get: vi.fn() },
  post: mockPost,
}));

import Discord from '../../../server/notifications/discord.js';

const monitor = { name: 'site', url: 'https://x', interval: 30 } as any;
const heartbeat = { status: 0, message: 'down', latency: 0 } as any;
const baseNotification = {
  token: 'https://discord.test/webhook',
  messageType: 'basic',
} as any;

describe('server/notifications/discord', () => {
  beforeEach(() => mockPost.mockReset());

  it('send() posts to the webhook and returns success', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const d = new Discord();
    const result = await d.send(baseNotification, monitor, heartbeat);
    expect(result).toBe(d.success);
    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost.mock.calls[0][0]).toBe(baseNotification.token);
  });

  it('sendRecovery() posts the recovery template', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const d = new Discord();
    await d.sendRecovery(baseNotification, monitor, heartbeat);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  it('test() posts a fixed test message', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const d = new Discord();
    await d.test(baseNotification);
    expect(mockPost.mock.calls[0][1]).toEqual({
      content: 'This is a test message',
    });
  });

  it('handleError wraps an error and re-throws (covered by base unit)', () => {
    const d = new Discord();
    expect(() => d.handleError(new Error('boom'))).toThrow(/boom/);
  });
});
