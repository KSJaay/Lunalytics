import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('ping', () => ({
  default: { promise: { probe: vi.fn() } },
  promise: { probe: vi.fn() },
}));

import ping from 'ping';
import pingStatusCheck from '../../../server/tools/icmpPing.js';

const monitor = {
  monitorId: 'icmp-1',
  workspaceId: 'ws-1',
  url: '1.1.1.1',
  requestTimeout: 5,
} as any;

describe('server/tools/icmpPing', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns isDown=false when host is alive', async () => {
    (ping.promise.probe as any).mockResolvedValue({ alive: true });
    const result = await pingStatusCheck(monitor);
    expect(result.isDown).toBe(false);
    expect(result.message).toContain('Up');
  });

  it('returns isDown=true when host is not alive', async () => {
    (ping.promise.probe as any).mockResolvedValue({ alive: false });
    const result = await pingStatusCheck(monitor);
    expect(result.isDown).toBe(true);
  });

  it('returns isDown=true when probe rejects', async () => {
    (ping.promise.probe as any).mockRejectedValue(new Error('boom'));
    const result = await pingStatusCheck(monitor);
    expect(result.isDown).toBe(true);
  });
});
