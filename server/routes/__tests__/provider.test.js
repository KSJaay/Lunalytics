// Polyfill setImmediate for Jest
if (typeof setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// 🔹 Mock permissions middleware
jest.mock('../../middleware/user/hasPermission.js', () => ({
  hasRequiredPermission: () => (req, res, next) => next(),
}));

// 🔹 Mock provider middleware
jest.mock('../../middleware/provider/delete.js', () => (req, res) => res.send('provider delete executed'));
jest.mock('../../middleware/provider/configure.js', () => (req, res) => res.send('provider configure executed'));
jest.mock('../../middleware/provider/getAll.js', () => (req, res) => res.send('provider getAll executed'));

// 🔹 Import express, supertest, and the router after mocks
import express from 'express';
import request from 'supertest';
import providerRouter from '../provider.js'; // router to test

// 🔹 Setup Express app
const app = express();
app.use(express.json());
app.use('/api/provider', providerRouter); // register router

// ✅ Tests
describe('Provider Router Tests', () => {
  test('GET /api/provider', async () => {
    const res = await request(app).get('/api/provider');
    expect(res.text).toBe('provider getAll executed');
  });

  test('POST /api/provider/configure', async () => {
    const res = await request(app).post('/api/provider/configure');
    expect(res.text).toBe('provider configure executed');
  });

  test('POST /api/provider/delete', async () => {
    const res = await request(app).post('/api/provider/delete');
    expect(res.text).toBe('provider delete executed');
  });
});
