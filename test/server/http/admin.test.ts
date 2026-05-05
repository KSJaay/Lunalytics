import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { buildTestApp } from '../../_helpers/app.js';
import { useTestDatabase } from '../../_helpers/db.js';
import { authenticate } from '../../_helpers/auth.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';

useTestDatabase();

const adminAuth = () => authenticate({}, MemberPermissionBits.ADMINISTRATOR);

describe('GET /api/admin/users', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).get('/api/admin/users');
    expect(res.status).toBe(401);
  });

  it('200 returns users when authenticated', async () => {
    const app = await buildTestApp();
    const ctx = await adminAuth();
    const res = await request(app)
      .get('/api/admin/users')
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(200);
    expect(res.body.users).toBeDefined();
  });
});

describe('GET /api/admin/workspaces', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).get('/api/admin/workspaces');
    expect(res.status).toBe(401);
  });

  it('200 returns workspaces when authenticated', async () => {
    const app = await buildTestApp();
    const ctx = await adminAuth();
    const res = await request(app)
      .get('/api/admin/workspaces')
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(200);
  });
});
