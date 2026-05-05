import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }));

vi.mock('axios', () => ({
  default: { post: mockPost, get: vi.fn() },
  post: mockPost,
}));

import Apprise from '../../../server/notifications/apprise.js';

const monitor = { name: 'site', url: 'https://x', interval: 30 } as any;
const heartbeat = { status: 0, message: 'down', latency: 0 } as any;
const baseNotification = {
  token: 'http://apprise.test/notify',
  messageType: 'basic',
  data: { urls: 'mailto://a@b.c, discord://x/y' },
} as any;

describe('server/notifications/apprise', () => {
  beforeEach(() => mockPost.mockReset());

  it('send() posts to the apprise endpoint with parsed urls', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const a = new Apprise();
    const result = await a.send(baseNotification, monitor, heartbeat);
    expect(result).toBe(a.success);
    const [url, body] = mockPost.mock.calls[0];
    expect(url).toBe(baseNotification.token);
    expect(body.urls).toEqual(['mailto://a@b.c', 'discord://x/y']);
  });

  it('sendRecovery() posts the recovery payload', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const a = new Apprise();
    await a.sendRecovery(baseNotification, monitor, heartbeat);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  it('test() posts a test payload', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const a = new Apprise();
    await a.test(baseNotification);
    expect(mockPost.mock.calls[0][1].title).toBe('This is a test message');
  });
});
