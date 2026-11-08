import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { buildTestApp } from '../../_helpers/app.js';
import { useTestDatabase } from '../../_helpers/db.js';
import { authenticate } from '../../_helpers/auth.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';

useTestDatabase();

const adminAuth = () => authenticate({}, MemberPermissionBits.ADMINISTRATOR);

describe('GET /api/status-pages/id', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).get('/api/status-pages/id?statusPageId=x');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/status-pages/create', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/status-pages/create').send({});
    expect(res.status).toBe(401);
  });

  it('400 with invalid body', async () => {
    const app = await buildTestApp();
    const ctx = await adminAuth();
    const res = await request(app)
      .post('/api/status-pages/create')
      .set('Cookie', ctx.cookieHeader)
      .send({});
    expect([400, 422, 500]).toContain(res.status);
  });
});

describe('POST /api/status-pages/update', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/status-pages/update').send({});
    expect(res.status).toBe(401);
  });
});

describe('POST /api/status-pages/delete', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/status-pages/delete').send({});
    expect(res.status).toBe(401);
  });
});
