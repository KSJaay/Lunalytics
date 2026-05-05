import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

import { buildTestApp } from '../../_helpers/app.js';
import { useTestDatabase } from '../../_helpers/db.js';
import { seedUser } from '../../_helpers/factories/user.js';
import { seedWorkspace } from '../../_helpers/factories/workspace.js';
import database from '../../../server/database/connection.js';
import statusCache from '../../../server/cache/status.js';

useTestDatabase();

const insertStatusPage = async (
  workspaceId: string,
  email: string,
  opts: { isPublic?: boolean; statusUrl?: string } = {}
) => {
  const statusId = 'sp-' + Math.random().toString(36).slice(2, 8);
  const statusUrl =
    opts.statusUrl ?? 'url-' + Math.random().toString(36).slice(2, 8);
  const client = await database.connect();
  await client!('status_page').insert({
    statusId,
    statusUrl,
    settings: JSON.stringify({ isPublic: opts.isPublic ?? false }),
    layout: JSON.stringify([]),
    email,
    workspaceId,
  });
  return { statusId, statusUrl };
};

describe('GET /api/status', () => {
  beforeEach(() => {
    statusCache.statusPages.clear();
    statusCache.monitors.clear();
    statusCache.heartbeats.clear();
    statusCache.incidents.clear();
  });

  it('400 when statusPageId is missing', async () => {
    const app = await buildTestApp();
    const res = await request(app).get('/api/status');
    expect(res.status).toBe(400);
  });

  it('404 when status page does not exist', async () => {
    const app = await buildTestApp();
    const res = await request(app).get('/api/status?statusPageId=missing');
    expect(res.status).toBe(404);
  });

  it('200 returns a public status page without auth', async () => {
    const app = await buildTestApp();
    const u = await seedUser();
    const ws = await seedWorkspace({ ownerId: u.email });
    const sp = await insertStatusPage(ws.id, u.email, { isPublic: true });
    await statusCache.loadAllStatusPages();

    const res = await request(app).get(
      `/api/status?statusPageId=${sp.statusUrl}`
    );
    expect(res.status).toBe(200);
    expect(res.body.statusId).toBe(sp.statusId);
  });

  it('401 for a private status page when unauthenticated', async () => {
    const app = await buildTestApp();
    const u = await seedUser();
    const ws = await seedWorkspace({ ownerId: u.email });
    const sp = await insertStatusPage(ws.id, u.email, { isPublic: false });
    await statusCache.loadAllStatusPages();

    const res = await request(app).get(
      `/api/status?statusPageId=${sp.statusUrl}`
    );
    expect(res.status).toBe(401);
  });
});
