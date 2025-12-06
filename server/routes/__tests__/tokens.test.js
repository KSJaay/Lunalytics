// Polyfill setImmediate for Jest
if (typeof setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// 🔹 Mock all middleware
jest.mock('../../middleware/tokens/getAll.js', () => jest.fn((req, res) => res.send('get all tokens executed')));
jest.mock('../../middleware/tokens/create.js', () => jest.fn((req, res) => res.send('create token executed')));
jest.mock('../../middleware/tokens/update.js', () => jest.fn((req, res) => res.send('update token executed')));
jest.mock('../../middleware/tokens/delete.js', () => jest.fn((req, res) => res.send('delete token executed')));

// 🔹 Mock permissions middleware
jest.mock('../../middleware/user/hasPermission.js', () => ({
  hasRequiredPermission: () => (req, res, next) => next(),
}));

// 🔹 Import dependencies after mocks
import express from 'express';
import request from 'supertest';
import tokensRouter from '../tokens.js';

// 🔹 Setup Express app
const app = express();
app.use(express.json());
app.use('/api/tokens', tokensRouter);

// ✅ Tests
describe('API Tokens Router', () => {
  test('GET /api/tokens -> getAllApiTokensMiddleware', async () => {
    const res = await request(app).get('/api/tokens');
    expect(res.text).toBe('get all tokens executed');
  });

  test('POST /api/tokens/create -> createApiTokenMiddleware', async () => {
    const res = await request(app).post('/api/tokens/create');
    expect(res.text).toBe('create token executed');
  });

  test('POST /api/tokens/update -> updateApiTokenMiddleware', async () => {
    const res = await request(app).post('/api/tokens/update');
    expect(res.text).toBe('update token executed');
  });

  test('POST /api/tokens/delete -> deleteApiTokenMiddleware', async () => {
    const res = await request(app).post('/api/tokens/delete');
    expect(res.text).toBe('delete token executed');
  });
});
