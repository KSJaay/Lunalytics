import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

vi.mock('../../server/cache/monitor/index.js', () => ({
  default: {
    checkMonitorStatus: vi.fn(async () => undefined),
    removeMonitor: vi.fn(),
  },
}));

import { buildTestApp } from '../../_helpers/app.js';
import { useTestDatabase } from '../../_helpers/db.js';
import { authenticate } from '../../_helpers/auth.js';
import { seedMonitor } from '../../_helpers/factories/monitor.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import database from '../../../server/database/connection.js';

useTestDatabase();

describe('GET /api/monitor/id', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).get('/api/monitor/id?monitorId=x');
    expect(res.status).toBe(401);
  });

  it('400 when monitorId is missing', async () => {
    const app = await buildTestApp();
    const ctx = await authenticate();
    const res = await request(app)
      .get('/api/monitor/id')
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(400);
  });

  it('422 when the monitor does not exist', async () => {
    const app = await buildTestApp();
    const ctx = await authenticate();
    const res = await request(app)
      .get('/api/monitor/id?monitorId=does-not-exist')
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(422);
  });

  it('200 returns a known monitor', async () => {
    const app = await buildTestApp();
    const ctx = await authenticate();
    const m = await seedMonitor({
      email: ctx.user.email,
      workspaceId: ctx.workspace.id,
    });
    const res = await request(app)
      .get(`/api/monitor/id?monitorId=${m.monitorId}`)
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(200);
    expect(res.body.monitorId).toBe(m.monitorId);
  });
});

describe('POST /api/monitor/add', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/monitor/add').send({});
    expect(res.status).toBe(401);
  });

  it('401 when the user lacks MANAGE_MONITORS permission', async () => {
    const app = await buildTestApp();
    const ctx = await authenticate({}, MemberPermissionBits.VIEW_MONITORS);
    const res = await request(app)
      .post('/api/monitor/add')
      .set('Cookie', ctx.cookieHeader)
      .send({ type: 'http', url: 'https://example.com', monitorId: 'm1' });
    expect(res.status).toBe(401);
  });

  it('400 for an unknown monitor type', async () => {
    const app = await buildTestApp();
    const ctx = await authenticate();
    const res = await request(app)
      .post('/api/monitor/add')
      .set('Cookie', ctx.cookieHeader)
      .send({ type: 'unknown' });
    expect(res.status).toBe(400);
  });

  it('200 creates a new http monitor', async () => {
    const app = await buildTestApp();
    const ctx = await authenticate();
    const res = await request(app)
      .post('/api/monitor/add')
      .set('Cookie', ctx.cookieHeader)
      .send({
        type: 'http',
        name: 'Example',
        url: 'https://example.com',
        monitorId: 'm-add-1',
        method: 'GET',
        valid_status_codes: ['200-299'],
        notificationType: 'All',
      });
    expect(res.status).toBe(200);
    expect(res.body.monitorId).toBeTruthy();

    const client = await database.connect();
    const row = await client!('monitor')
      .where({ monitorId: res.body.monitorId })
      .first();
    expect(row).toBeDefined();
  });
});

describe('GET /api/monitor/delete', () => {
  it('400 when monitorId is missing', async () => {
    const app = await buildTestApp();
    const ctx = await authenticate();
    const res = await request(app)
      .get('/api/monitor/delete')
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(400);
  });

  it('200 deletes an existing monitor', async () => {
    const app = await buildTestApp();
    const ctx = await authenticate();
    const m = await seedMonitor({
      email: ctx.user.email,
      workspaceId: ctx.workspace.id,
    });
    const res = await request(app)
      .get(`/api/monitor/delete?monitorId=${m.monitorId}`)
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(200);

    const client = await database.connect();
    const row = await client!('monitor')
      .where({ monitorId: m.monitorId })
      .first();
    expect(row).toBeUndefined();
  });
});

describe('GET /api/monitor/status', () => {
  it('400 when monitorId is missing', async () => {
    const app = await buildTestApp();
    const ctx = await authenticate();
    const res = await request(app)
      .get('/api/monitor/status')
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(400);
  });

  it('400 when type is invalid', async () => {
    const app = await buildTestApp();
    const ctx = await authenticate();
    const res = await request(app)
      .get('/api/monitor/status?monitorId=x&type=bogus')
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(400);
  });

  it('422 when the monitor does not exist', async () => {
    const app = await buildTestApp();
    const ctx = await authenticate();
    const res = await request(app)
      .get('/api/monitor/status?monitorId=missing')
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(422);
  });
});
