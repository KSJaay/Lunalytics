import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('gamedig', () => ({
  GameDig: { query: vi.fn() },
}));

import { GameDig } from 'gamedig';
import gamedigStatusCheck from '../../../server/tools/gamedig.js';

const monitor = {
  monitorId: 'gd-1',
  workspaceId: 'ws-1',
  game: 'minecraft',
  url: 'mc.example.com',
  port: 25565,
} as any;

describe('server/tools/gamedig', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns isDown=false on a successful query', async () => {
    (GameDig.query as any).mockResolvedValue({ ping: 25, name: 'My Server' });
    const result = await gamedigStatusCheck(monitor);
    expect(result.isDown).toBe(false);
    expect(result.message).toBe('My Server');
    expect(result.latency).toBe(25);
  });

  it('returns isDown=true when query throws', async () => {
    (GameDig.query as any).mockRejectedValue(new Error('refused'));
    const result = await gamedigStatusCheck(monitor);
    expect(result.isDown).toBe(true);
    expect(result.message).toContain('refused');
  });
});
