// Polyfill setImmediate for Jest
if (typeof setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// 🔹 Mock all middleware
jest.mock('../../middleware/status/create.js', () => jest.fn((req, res) => res.send('create route executed')));
jest.mock('../../middleware/status/getUsingId.js', () => jest.fn((req, res) => res.send('get by id route executed')));
jest.mock('../../middleware/status/getAll.js', () => jest.fn((req, res) => res.send('get all route executed')));
jest.mock('../../middleware/status/edit.js', () => jest.fn((req, res) => res.send('edit route executed')));
jest.mock('../../middleware/status/delete.js', () => jest.fn((req, res) => res.send('delete route executed')));

// 🔹 Mock permissions middleware
jest.mock('../../middleware/user/hasPermission.js', () => ({
  hasRequiredPermission: () => (req, res, next) => next(),
}));

// 🔹 Import dependencies after mocks
import express from 'express';
import request from 'supertest';
import statusPagesRouter from '../statusPages.js';

// 🔹 Setup Express app
const app = express();
app.use(express.json());
app.use('/api/status-pages', statusPagesRouter);

// ✅ Tests
describe('Status Pages Router', () => {
  test('GET /api/status-pages/ -> getAllStatusPagesMiddleware', async () => {
    const res = await request(app).get('/api/status-pages/');
    expect(res.text).toBe('get all route executed');
  });

  test('GET /api/status-pages/id -> getUsingIdMiddleware', async () => {
    const res = await request(app).get('/api/status-pages/id');
    expect(res.text).toBe('get by id route executed');
  });

  test('POST /api/status-pages/create -> createStatusPageMiddleware', async () => {
    const res = await request(app).post('/api/status-pages/create');
    expect(res.text).toBe('create route executed');
  });

  test('POST /api/status-pages/update -> editStatusPageMiddleware', async () => {
    const res = await request(app).post('/api/status-pages/update');
    expect(res.text).toBe('edit route executed');
  });

  test('POST /api/status-pages/delete -> deleteStatusPageMiddleware', async () => {
    const res = await request(app).post('/api/status-pages/delete');
    expect(res.text).toBe('delete route executed');
  });
});
