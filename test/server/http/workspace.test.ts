import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { buildTestApp } from '../../_helpers/app.js';
import { useTestDatabase } from '../../_helpers/db.js';
import { authenticate } from '../../_helpers/auth.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';

useTestDatabase();

const adminAuth = () => authenticate({}, MemberPermissionBits.ADMINISTRATOR);

describe('GET /api/workspace/monitors', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).get('/api/workspace/monitors');
    expect(res.status).toBe(401);
  });

  it('200 returns monitors array', async () => {
    const app = await buildTestApp();
    const ctx = await adminAuth();
    const res = await request(app)
      .get('/api/workspace/monitors')
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/workspace/notifications', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).get('/api/workspace/notifications');
    expect(res.status).toBe(401);
  });

  it('200 when authenticated', async () => {
    const app = await buildTestApp();
    const ctx = await adminAuth();
    const res = await request(app)
      .get('/api/workspace/notifications')
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(200);
  });
});

describe('GET /api/workspace/incidents', () => {
  it('200 when authenticated', async () => {
    const app = await buildTestApp();
    const ctx = await adminAuth();
    const res = await request(app)
      .get('/api/workspace/incidents')
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(200);
  });
});

describe('GET /api/workspace/status-pages', () => {
  it('200 when authenticated', async () => {
    const app = await buildTestApp();
    const ctx = await adminAuth();
    const res = await request(app)
      .get('/api/workspace/status-pages')
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(200);
  });
});

describe('GET /api/workspace/api-tokens', () => {
  it('404 when there are no tokens', async () => {
    const app = await buildTestApp();
    const ctx = await adminAuth();
    const res = await request(app)
      .get('/api/workspace/api-tokens')
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(404);
  });
});

describe('GET /api/workspace/members', () => {
  it('200 when authenticated', async () => {
    const app = await buildTestApp();
    const ctx = await adminAuth();
    const res = await request(app)
      .get('/api/workspace/members')
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(200);
  });
});

describe('GET /api/workspace/members/@me', () => {
  it('200 when authenticated', async () => {
    const app = await buildTestApp();
    const ctx = await adminAuth();
    const res = await request(app)
      .get('/api/workspace/members/@me')
      .set('Cookie', ctx.cookieHeader);
    expect(res.status).toBe(200);
  });
});

describe('POST /api/workspace/create', () => {
  it('401 when unauthenticated', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/workspace/create').send({});
    expect(res.status).toBe(401);
  });

  it('400 or 422 with invalid body', async () => {
    const app = await buildTestApp();
    const ctx = await adminAuth();
    const res = await request(app)
      .post('/api/workspace/create')
      .set('Cookie', ctx.cookieHeader)
      .send({});
    expect([400, 422]).toContain(res.status);
  });
});
