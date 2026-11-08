import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockSendMail, mockCreateTransport } = vi.hoisted(() => {
  const mockSendMail = vi.fn();
  const mockCreateTransport = vi.fn(() => ({ sendMail: mockSendMail }));
  return { mockSendMail, mockCreateTransport };
});

vi.mock('nodemailer', () => ({
  default: { createTransport: mockCreateTransport },
  createTransport: mockCreateTransport,
}));

import Email from '../../../server/notifications/email.js';

const monitor = { name: 'site', url: 'https://x', interval: 30 } as any;
const heartbeat = { status: 0, message: 'down', latency: 0 } as any;
const baseNotification = {
  token: 'smtp.example.com',
  messageType: 'basic',
  data: {
    port: 587,
    security: false,
    username: 'a@b.c',
    password: 'pw',
    fromEmail: 'a@b.c',
    toEmail: 'to@b.c',
  },
} as any;

describe('server/notifications/email', () => {
  beforeEach(() => {
    mockSendMail.mockReset();
    mockCreateTransport.mockClear();
  });

  it('send() builds a transport and sends an email', async () => {
    mockSendMail.mockResolvedValue({ accepted: ['to@b.c'] });
    const e = new Email();
    const result = await e.send(baseNotification, monitor, heartbeat);
    expect(result).toBe(e.success);
    expect(mockCreateTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'smtp.example.com',
        port: 587,
        auth: { user: 'a@b.c', pass: 'pw' },
      })
    );
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    expect(mockSendMail.mock.calls[0][0].subject).toMatch(/is down/);
  });

  it('sendRecovery() sends a recovery email', async () => {
    mockSendMail.mockResolvedValue({});
    const e = new Email();
    await e.sendRecovery(baseNotification, monitor, heartbeat);
    expect(mockSendMail.mock.calls[0][0].subject).toMatch(/recovered/);
  });

  it('test() sends a test SMTP email', async () => {
    mockSendMail.mockResolvedValue({});
    const e = new Email();
    await e.test(baseNotification);
    expect(mockSendMail.mock.calls[0][0].subject).toMatch(/Test SMTP/i);
  });
});
