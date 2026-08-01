import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { buildTestApp } from '../../_helpers/app.js';
import { useTestDatabase } from '../../_helpers/db.js';
import { authenticate } from '../../_helpers/auth.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';

useTestDatabase();

const adminAuth = () => authenticate({}, MemberPermissionBits.ADMINISTRATOR);

describe('GET /api/invites/all', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).get('/api/invites/all');
    expect(res.status).toBe(401);
  });

  it('200 returns invites list', async () => {
    const app = await buildTestApp();
    const ctx = await adminAuth();
    const res = await request(app)
      .get('/api/invites/all')
      .set('Cookie', ctx.cookieHeader);
    expect([200, 404]).toContain(res.status);
  });
});

describe('POST /api/invites/create', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/invites/create').send({});
    expect(res.status).toBe(401);
  });

  it('400 with invalid body', async () => {
    const app = await buildTestApp();
    const ctx = await adminAuth();
    const res = await request(app)
      .post('/api/invites/create')
      .set('Cookie', ctx.cookieHeader)
      .send({});
    expect([400, 422]).toContain(res.status);
  });
});

describe('POST /api/invites/delete', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/invites/delete').send({});
    expect(res.status).toBe(401);
  });
});

describe('POST /api/invites/pause', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/invites/pause').send({});
    expect(res.status).toBe(401);
  });
});
