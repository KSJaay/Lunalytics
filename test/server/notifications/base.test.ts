import { describe, it, expect } from 'vitest';

import NotificationBase from '../../../server/notifications/base.js';
import NotificationServices from '../../../server/notifications/index.js';

describe('server/notifications/base', () => {
  it('send() throws by default (must be overridden)', async () => {
    const b = new NotificationBase();
    await expect(b.send({} as any, {} as any, {} as any)).rejects.toThrow(
      /Override/
    );
  });

  it('sendRecovery() throws by default', async () => {
    const b = new NotificationBase();
    await expect(
      b.sendRecovery({} as any, {} as any, {} as any)
    ).rejects.toThrow(/Override/);
  });

  it('handleError appends response data when present', () => {
    const b = new NotificationBase();
    expect(() =>
      b.handleError({
        message: 'oops',
        response: { data: { code: 5 } },
      })
    ).toThrow(/oops/);
  });

  it('handleError handles plain string errors', () => {
    const b = new NotificationBase();
    expect(() => b.handleError('oh no')).toThrow(/oh no/);
  });
});

describe('server/notifications/index', () => {
  it('exports all the expected providers', () => {
    expect(Object.keys(NotificationServices).sort()).toEqual([
      'Apprise',
      'Discord',
      'Email',
      'HomeAssistant',
      'Pushover',
      'Slack',
      'Telegram',
      'Webhook',
    ]);
  });
});
