import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { buildTestApp } from '../../_helpers/app.js';
import { useTestDatabase } from '../../_helpers/db.js';
import { seedUser } from '../../_helpers/factories/user.js';
import { seedWorkspace } from '../../_helpers/factories/workspace.js';
import { seedMonitor } from '../../_helpers/factories/monitor.js';
import database from '../../../server/database/connection.js';

useTestDatabase();

describe('POST /api/push', () => {
  it('401 when token is missing', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/push').send({});
    expect(res.status).toBe(401);
  });

  it('422 when token does not match a monitor', async () => {
    const app = await buildTestApp();
    const res = await request(app)
      .post('/api/push')
      .send({ token: 'unknown-token' });
    expect(res.status).toBe(422);
  });

  it('200 inserts a heartbeat for a known push monitor', async () => {
    const app = await buildTestApp();
    const u = await seedUser();
    const ws = await seedWorkspace({ ownerId: u.email });
    const token = 'push-token-' + Math.random().toString(36).slice(2, 8);
    const m = await seedMonitor({
      email: u.email,
      workspaceId: ws.id,
      type: 'push',
      url: token,
    });

    const res = await request(app)
      .post('/api/push')
      .send({ token, status: 'up', latency: 42, message: 'ok' });
    expect(res.status).toBe(200);

    const client = await database.connect();
    const beats = await client!('heartbeat')
      .where({ monitorId: m.monitorId })
      .select('*');
    expect(beats.length).toBeGreaterThan(0);
  });
});
