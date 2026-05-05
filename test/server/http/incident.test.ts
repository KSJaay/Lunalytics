import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { buildTestApp } from '../../_helpers/app.js';
import { useTestDatabase } from '../../_helpers/db.js';
import { authenticate } from '../../_helpers/auth.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';

useTestDatabase();

const adminAuth = () => authenticate({}, MemberPermissionBits.ADMINISTRATOR);

describe('POST /api/incident/create', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/incident/create').send({});
    expect(res.status).toBe(401);
  });

  it('400 with invalid body', async () => {
    const app = await buildTestApp();
    const ctx = await adminAuth();
    const res = await request(app)
      .post('/api/incident/create')
      .set('Cookie', ctx.cookieHeader)
      .send({});
    expect([400, 422]).toContain(res.status);
  });
});

describe('POST /api/incident/update', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/incident/update').send({});
    expect(res.status).toBe(401);
  });
});

describe('POST /api/incident/delete', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/incident/delete').send({});
    expect(res.status).toBe(401);
  });
});

describe('POST /api/incident/messages/create', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app)
      .post('/api/incident/messages/create')
      .send({});
    expect(res.status).toBe(401);
  });
});

describe('POST /api/incident/messages/update', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app)
      .post('/api/incident/messages/update')
      .send({});
    expect(res.status).toBe(401);
  });
});

describe('POST /api/incident/messages/delete', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app)
      .post('/api/incident/messages/delete')
      .send({});
    expect(res.status).toBe(401);
  });
});
