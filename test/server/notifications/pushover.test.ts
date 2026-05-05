import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }));

vi.mock('axios', () => ({
  default: { post: mockPost, get: vi.fn() },
  post: mockPost,
}));

import Pushover from '../../../server/notifications/pushover.js';

const monitor = { name: 'site', url: 'https://x', interval: 30 } as any;
const heartbeat = { status: 0, message: 'down', latency: 0 } as any;
const baseNotification = {
  token: 'app-token',
  messageType: 'basic',
  data: { userKey: 'user-key', priority: 1 },
} as any;

describe('server/notifications/pushover', () => {
  beforeEach(() => mockPost.mockReset());

  it('send() posts to api.pushover.net with the user key and token', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const p = new Pushover();
    const result = await p.send(baseNotification, monitor, heartbeat);
    expect(result).toBe(p.success);
    const [url, body] = mockPost.mock.calls[0];
    expect(url).toBe('https://api.pushover.net/1/messages.json');
    expect(body.token).toBe('app-token');
    expect(body.user).toBe('user-key');
    expect(body.priority).toBe(1);
  });

  it('sendRecovery() posts the recovery payload', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const p = new Pushover();
    await p.sendRecovery(baseNotification, monitor, heartbeat);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  it('test() posts a test message with title', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const p = new Pushover();
    await p.test(baseNotification);
    expect(mockPost.mock.calls[0][1].title).toBe('Lunalytics Test Message');
  });
});
