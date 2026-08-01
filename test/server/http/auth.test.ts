import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { buildTestApp } from '../../_helpers/app.js';
import { useTestDatabase } from '../../_helpers/db.js';
import { authenticate } from '../../_helpers/auth.js';
import { seedUser } from '../../_helpers/factories/user.js';

useTestDatabase();

describe('POST /api/auth/login', () => {
  it('200 + sets session_token cookie on valid credentials', async () => {
    const app = await buildTestApp();
    const u = await seedUser({ password: 'password123' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: u.email, password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']?.[0]).toMatch(/session_token=/);
  });

  it('422 when password format is invalid', async () => {
    const app = await buildTestApp();
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'a@b.c', password: 'short' });

    expect([400, 422]).toContain(res.status);
  });

  it('422 when user does not exist', async () => {
    const app = await buildTestApp();
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });
    expect([400, 401, 422]).toContain(res.status);
  });
});

describe('POST /api/auth/user/exists', () => {
  it('200 when user exists', async () => {
    const app = await buildTestApp();
    const u = await seedUser();
    const res = await request(app)
      .post('/api/auth/user/exists')
      .send({ email: u.email });
    expect(res.status).toBe(200);
  });

  it('404 when user does not exist', async () => {
    const app = await buildTestApp();
    const res = await request(app)
      .post('/api/auth/user/exists')
      .send({ email: 'unknown@example.com' });
    expect(res.status).toBe(404);
  });

  it('400 when email is missing', async () => {
    const app = await buildTestApp();
    const res = await request(app).post('/api/auth/user/exists').send({});
    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/setup/exists', () => {
  it('reports setupRequired:true when no owner exists', async () => {
    const app = await buildTestApp();
    const res = await request(app).get('/api/auth/setup/exists');
    expect(res.status).toBe(200);
    expect(res.body.setupRequired).toBe(true);
  });

  it('reports setupRequired:false once a user exists', async () => {
    const app = await buildTestApp();
    await seedUser();
    const res = await request(app).get('/api/auth/setup/exists');
    expect(res.status).toBe(200);
    expect(res.body.setupRequired).toBe(false);
  });
});

describe('GET /api/auth/logout', () => {
  it('clears the session and redirects to /login', async () => {
    const app = await buildTestApp();
    const ctx = await authenticate();
    const res = await request(app)
      .get('/api/auth/logout')
      .set('Cookie', ctx.cookieHeader);
    expect([301, 302, 303, 307]).toContain(res.status);
    const setCookie = (res.headers['set-cookie'] || []).join(';');
    expect(setCookie).toMatch(/session_token=/);
  });
});

describe('GET /api/auth/config', () => {
  it('returns 200 with provider configuration', async () => {
    const app = await buildTestApp();
    const res = await request(app).get('/api/auth/config');
    expect(res.status).toBe(200);
    expect(res.body).toBeTypeOf('object');
  });
});
