import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { useTestDatabase } from '../../_helpers/db.js';
import { seedUser } from '../../_helpers/factories/user.js';
import { seedWorkspace } from '../../_helpers/factories/workspace.js';
import { seedMonitor } from '../../_helpers/factories/monitor.js';
import { createHeartbeat } from '../../../server/database/queries/heartbeat.js';
import pushStatusCheck from '../../../server/tools/push.js';

useTestDatabase();

describe('server/tools/push', () => {
  beforeEach(() => vi.useRealTimers());
  afterEach(() => vi.useRealTimers());

  it('returns false (no result) when a recent heartbeat exists', async () => {
    const u = await seedUser();
    const ws = await seedWorkspace({ ownerId: u.email });
    const m = await seedMonitor({
      email: u.email,
      workspaceId: ws.id,
      interval: 60,
    });

    await createHeartbeat({
      monitorId: m.monitorId,
      workspaceId: ws.id,
      status: 'up',
      latency: 10,
      message: 'ok',
      isDown: false,
    } as any);

    const result = await pushStatusCheck({
      monitorId: m.monitorId,
      workspaceId: ws.id,
      interval: 60,
    } as any);
    expect(result).toBe(false);
  });

  it('returns isDown=true when last heartbeat is older than the interval', async () => {
    const u = await seedUser();
    const ws = await seedWorkspace({ ownerId: u.email });
    const m = await seedMonitor({
      email: u.email,
      workspaceId: ws.id,
      interval: 60,
    });

    await createHeartbeat({
      monitorId: m.monitorId,
      workspaceId: ws.id,
      status: 'up',
      latency: 10,
      message: 'ok',
      isDown: false,
    } as any);

    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.now() + 5 * 60 * 1000));

    const result: any = await pushStatusCheck({
      monitorId: m.monitorId,
      workspaceId: ws.id,
      interval: 60,
    } as any);
    expect(result).not.toBe(false);
    expect(result.isDown).toBe(true);
  });
});
