import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useTestDatabase } from '../../_helpers/db.js';
import { seedUser } from '../../_helpers/factories/user.js';
import { seedWorkspace } from '../../_helpers/factories/workspace.js';
import { seedMonitor } from '../../_helpers/factories/monitor.js';
import database from '../../../server/database/connection.js';

vi.mock('../../../server/tools/httpStatus.js', () => ({
  default: vi.fn(async (m: any) => ({
    monitorId: m.monitorId,
    workspaceId: m.workspaceId,
    status: 200,
    latency: 1,
    message: 'ok',
    isDown: false,
  })),
}));
vi.mock('../../../server/tools/dns.js', () => ({ default: vi.fn() }));
vi.mock('../../../server/tools/docker.js', () => ({ default: vi.fn() }));
vi.mock('../../../server/tools/gamedig.js', () => ({ default: vi.fn() }));
vi.mock('../../../server/tools/icmpPing.js', () => ({ default: vi.fn() }));
vi.mock('../../../server/tools/jsonStatus.js', () => ({ default: vi.fn() }));
vi.mock('../../../server/tools/push.js', () => ({ default: vi.fn() }));
vi.mock('../../../server/tools/tcpPing.js', () => ({ default: vi.fn() }));
vi.mock('../../../server/tools/checkCertificate.js', () => ({
  default: vi.fn(async () => ({ isValid: true })),
}));
vi.mock('../../../server/cache/monitor/notification.js', () => ({
  default: vi.fn(async () => undefined),
}));

import cache from '../../../server/cache/monitor/index.js';

useTestDatabase();

describe('server/cache/monitor MonitorCache', () => {
  beforeEach(() => {
    cache.timeouts.forEach((t: any) => clearTimeout(t));
    cache.timeouts.clear();
  });

  afterEach(() => {
    cache.timeouts.forEach((t: any) => clearTimeout(t));
    cache.timeouts.clear();
  });

  it('initialise() runs without error against an empty DB', async () => {
    await expect(cache.initialise()).resolves.toBeUndefined();
    expect(cache.timeouts.size).toBe(0);
  });

  it('checkMonitorStatus() schedules a timeout for an http monitor', async () => {
    const u = await seedUser();
    const ws = await seedWorkspace({ ownerId: u.email });
    const m = await seedMonitor({
      email: u.email,
      workspaceId: ws.id,
      type: 'http',
    });

    await cache.checkMonitorStatus(m.monitorId, ws.id);
    expect(cache.timeouts.has(m.monitorId)).toBe(true);
  });

  it('checkMonitorStatus() clears state when the monitor is gone', async () => {
    await cache.checkMonitorStatus('does-not-exist', 'no-workspace');
    expect(cache.timeouts.size).toBe(0);
  });

  it('removeMonitor() is a no-op when the timeout key does not match the cache key', async () => {
    const u = await seedUser();
    const ws = await seedWorkspace({ ownerId: u.email });
    const m = await seedMonitor({
      email: u.email,
      workspaceId: ws.id,
      type: 'http',
    });

    await cache.checkMonitorStatus(m.monitorId, ws.id);
    expect(cache.timeouts.has(m.monitorId)).toBe(true);
    cache.removeMonitor(m.monitorId, ws.id);
    expect(cache.timeouts.has(m.monitorId)).toBe(true);
  });

  it('checkMonitorStatus() skips paused monitors', async () => {
    const u = await seedUser();
    const ws = await seedWorkspace({ ownerId: u.email });
    const m = await seedMonitor({
      email: u.email,
      workspaceId: ws.id,
      type: 'http',
    });

    const client = await database.connect();
    await client!('monitor')
      .where({ monitorId: m.monitorId, workspaceId: ws.id })
      .update({ paused: true });

    await cache.checkMonitorStatus(m.monitorId, ws.id);
    expect(cache.timeouts.has(m.monitorId)).toBe(false);
  });
});
