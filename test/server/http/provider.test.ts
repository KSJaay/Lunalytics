import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { buildTestApp } from '../../_helpers/app.js';
import { useTestDatabase } from '../../_helpers/db.js';
import { authenticate } from '../../_helpers/auth.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';

useTestDatabase();

const adminAuth = () => authenticate({}, MemberPermissionBits.ADMINISTRATOR);

describe('GET /api/providers', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).get('/api/providers');
    expect(res.status).toBe(401);
  });

  it('200 returns providers list when authenticated', async () => {
    const app = await buildTestApp();
    const ctx = await adminAuth();
    const res = await request(app)
      .get('/api/providers')
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(200);
  });
});

describe('POST /api/provider/configure', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/provider/configure').send({});
    expect(res.status).toBe(401);
  });
});

describe('POST /api/provider/delete', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/provider/delete').send({});
    expect(res.status).toBe(401);
  });
});
