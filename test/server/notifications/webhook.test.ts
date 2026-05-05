import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }));

vi.mock('axios', () => ({
  default: { post: mockPost, get: vi.fn() },
  post: mockPost,
}));

import Webhook from '../../../server/notifications/webhook.js';

const monitor = { name: 'site', url: 'https://x', interval: 30 } as any;
const heartbeat = { status: 0, message: 'down', latency: 0 } as any;
const baseNotification = {
  token: 'https://hook.test/in',
  messageType: 'basic',
} as any;

describe('server/notifications/webhook', () => {
  beforeEach(() => mockPost.mockReset());

  it('send() posts JSON when no requestType is specified', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const w = new Webhook();
    await w.send(baseNotification, monitor, heartbeat);
    expect(mockPost).toHaveBeenCalledTimes(1);
    const [url, , opts] = mockPost.mock.calls[0];
    expect(url).toBe(baseNotification.token);
    expect(opts.headers).toEqual({});
  });

  it('send() merges customHeaders into request headers', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const w = new Webhook();
    await w.send(
      { ...baseNotification, customHeaders: { 'x-secret': 'y' } },
      monitor,
      heartbeat
    );
    const [, , opts] = mockPost.mock.calls[0];
    expect(opts.headers['x-secret']).toBe('y');
  });

  it('sendRecovery() posts the recovery template', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const w = new Webhook();
    await w.sendRecovery(baseNotification, monitor, heartbeat);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  it('test() posts a fixed test payload', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const w = new Webhook();
    await w.test(baseNotification);
    expect(mockPost.mock.calls[0][1]).toEqual({
      message: 'This is a test message from Lunalytics',
    });
  });
});
