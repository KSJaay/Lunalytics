import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { buildTestApp } from '../../_helpers/app.js';
import { useTestDatabase } from '../../_helpers/db.js';
import { authenticate } from '../../_helpers/auth.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';

useTestDatabase();

const adminAuth = () => authenticate({}, MemberPermissionBits.ADMINISTRATOR);

describe('GET /api/notification/id', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).get('/api/notification/id?notificationId=x');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/notification/create', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/notification/create').send({});
    expect(res.status).toBe(401);
  });

  it('400 with invalid body', async () => {
    const app = await buildTestApp();
    const ctx = await adminAuth();
    const res = await request(app)
      .post('/api/notification/create')
      .set('Cookie', ctx.cookieHeader)
      .send({});
    expect([400, 422]).toContain(res.status);
  });
});

describe('POST /api/notification/delete', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/notification/delete').send({});
    expect(res.status).toBe(401);
  });
});

describe('POST /api/notification/edit', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/notification/edit').send({});
    expect(res.status).toBe(401);
  });
});

describe('POST /api/notification/toggle', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/notification/toggle').send({});
    expect(res.status).toBe(401);
  });
});

describe('POST /api/notification/test', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/notification/test').send({});
    expect(res.status).toBe(401);
  });
});
