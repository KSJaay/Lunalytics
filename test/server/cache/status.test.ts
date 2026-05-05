import { describe, it, expect, beforeEach } from 'vitest';

import { useTestDatabase } from '../../_helpers/db.js';
import { seedUser } from '../../_helpers/factories/user.js';
import { seedWorkspace } from '../../_helpers/factories/workspace.js';
import { seedMonitor } from '../../_helpers/factories/monitor.js';
import database from '../../../server/database/connection.js';
import statusCache from '../../../server/cache/status.js';

useTestDatabase();

const insertStatusPage = async (
  workspaceId: string,
  email: string,
  layout: any[],
  statusId = 'sp-' + Math.random().toString(36).slice(2, 8),
  statusUrl = 'url-' + Math.random().toString(36).slice(2, 8)
) => {
  const client = await database.connect();
  await client!('status_page').insert({
    statusId,
    statusUrl,
    settings: JSON.stringify({}),
    layout: JSON.stringify(layout),
    email,
    workspaceId,
  });
  return statusId;
};

describe('server/cache/status Status', () => {
  beforeEach(() => {
    statusCache.statusPages.clear();
    statusCache.monitors.clear();
    statusCache.heartbeats.clear();
    statusCache.incidents.clear();
  });

  it('loadAllStatusPages() runs cleanly with no status pages', async () => {
    await expect(statusCache.loadAllStatusPages()).resolves.toBeUndefined();
    expect(statusCache.statusPages.size).toBe(0);
    expect(statusCache.monitors.size).toBe(0);
  });

  it('loads monitors when a status page references them via layout', async () => {
    const u = await seedUser();
    const ws = await seedWorkspace({ ownerId: u.email });
    const m = await seedMonitor({
      email: u.email,
      workspaceId: ws.id,
      type: 'http',
    });

    await insertStatusPage(ws.id, u.email, [
      { type: 'uptime', monitors: [{ id: m.monitorId }] },
    ]);

    await statusCache.loadAllStatusPages();
    expect(statusCache.statusPages.size).toBe(1);
    expect(statusCache.monitors.has(`${m.monitorId}:${ws.id}`)).toBe(true);
  });

  it('honours autoAdd in layout and includes all workspace monitors', async () => {
    const u = await seedUser();
    const ws = await seedWorkspace({ ownerId: u.email });
    const m1 = await seedMonitor({ email: u.email, workspaceId: ws.id });
    const m2 = await seedMonitor({ email: u.email, workspaceId: ws.id });

    await insertStatusPage(ws.id, u.email, [
      { type: 'uptime', autoAdd: true, monitors: [] },
    ]);

    await statusCache.loadAllStatusPages();
    expect(statusCache.monitors.has(`${m1.monitorId}:${ws.id}`)).toBe(true);
    expect(statusCache.monitors.has(`${m2.monitorId}:${ws.id}`)).toBe(true);
  });

  it('loadMonitorData() loads heartbeats into cache', async () => {
    const u = await seedUser();
    const ws = await seedWorkspace({ ownerId: u.email });
    const m = await seedMonitor({ email: u.email, workspaceId: ws.id });

    await statusCache.loadMonitorData(m.monitorId, ws.id);
    const monitorCacheId = `${m.monitorId}:${ws.id}`;
    expect(statusCache.monitors.has(monitorCacheId)).toBe(true);
    expect(statusCache.heartbeats.has(monitorCacheId)).toBe(true);
  });
});
