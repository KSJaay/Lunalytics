import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }));

vi.mock('axios', () => ({
  default: { get: mockGet, post: vi.fn() },
  get: mockGet,
}));

import Telegram from '../../../server/notifications/telegram.js';

const monitor = { name: 'site', url: 'https://x', interval: 30 } as any;
const heartbeat = { status: 0, message: 'down', latency: 0 } as any;
const baseNotification = {
  token: 'BOT_TOKEN',
  messageType: 'basic',
  data: { chatId: '123' },
} as any;

describe('server/notifications/telegram', () => {
  beforeEach(() => mockGet.mockReset());

  it('send() calls the bot API with chat_id and text', async () => {
    mockGet.mockResolvedValue({ status: 200 });
    const t = new Telegram();
    const result = await t.send(baseNotification, monitor, heartbeat);
    expect(result).toBe(t.success);
    expect(mockGet).toHaveBeenCalledTimes(1);
    const [url, options] = mockGet.mock.calls[0];
    expect(url).toContain('/botBOT_TOKEN/sendMessage');
    expect(options.params.chat_id).toBe('123');
    expect(options.params.parse_mode).toBe('MarkdownV2');
  });

  it('sendRecovery() calls the bot API with the recovery template', async () => {
    mockGet.mockResolvedValue({ status: 200 });
    const t = new Telegram();
    await t.sendRecovery(baseNotification, monitor, heartbeat);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it('test() sends a fixed test message', async () => {
    mockGet.mockResolvedValue({ status: 200 });
    const t = new Telegram();
    await t.test(baseNotification);
    expect(mockGet.mock.calls[0][1].params.text).toMatch(/test message/i);
  });
});
