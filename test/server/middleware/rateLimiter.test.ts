import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

import { authRateLimiter } from '../../../server/middleware/rateLimiter.js';

const buildApp = () => {
  const app = express();
  app.set('trust proxy', false);
  app.post('/auth', authRateLimiter, (_req, res) => res.sendStatus(200));
  return app;
};

describe('server/middleware/rateLimiter', () => {
  it('passes the first 15 requests and blocks the 16th with 429', async () => {
    const app = buildApp();
    for (let i = 0; i < 15; i++) {
      const r = await request(app).post('/auth');
      expect(r.status).toBe(200);
    }
    const blocked = await request(app).post('/auth');
    expect(blocked.status).toBe(429);
    expect(blocked.body.message).toMatch(/too many/i);
  });
});
