import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }));

vi.mock('axios', () => ({
  default: { post: mockPost, get: vi.fn() },
  post: mockPost,
}));

import HomeAssistant from '../../../server/notifications/homeAssistant.js';

const monitor = { name: 'site', url: 'https://x', interval: 30 } as any;
const heartbeat = { status: 0, message: 'down', latency: 0 } as any;
const baseNotification = {
  token: 'long-lived-token',
  messageType: 'basic',
  data: {
    homeAssistantUrl: 'http://homeassistant.test/',
    homeAssistantNotificationService: 'mobile_app_phone',
  },
} as any;

describe('server/notifications/homeAssistant', () => {
  beforeEach(() => mockPost.mockReset());

  it('send() posts to /api/services/notify/<service> with bearer auth', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const ha = new HomeAssistant();
    const result = await ha.send(baseNotification, monitor, heartbeat);
    expect(result).toBe(ha.success);
    const [url, , opts] = mockPost.mock.calls[0];
    expect(url).toBe(
      'http://homeassistant.test/api/services/notify/mobile_app_phone'
    );
    expect(opts.headers.Authorization).toBe('Bearer long-lived-token');
  });

  it('sendRecovery() posts the recovery payload', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const ha = new HomeAssistant();
    await ha.sendRecovery(baseNotification, monitor, heartbeat);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  it('test() posts a test payload', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const ha = new HomeAssistant();
    await ha.test(baseNotification);
    expect(mockPost.mock.calls[0][1].message).toMatch(/test message/i);
  });
});
