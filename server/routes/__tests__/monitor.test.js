// Polyfill setImmediate
if (typeof setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// 🔹 Mock permissions
jest.mock('../../middleware/user/hasPermission.js', () => ({
  hasRequiredPermission: () => (req, res, next) => next(),
}));

// 🔹 Mock monitor middleware
jest.mock('../../middleware/monitor/add.js', () => (req, res) => res.send('monitor add executed'));
jest.mock('../../middleware/monitor/edit.js', () => (req, res) => res.send('monitor edit executed'));
jest.mock('../../middleware/monitor/delete.js', () => (req, res) => res.send('monitor delete executed'));
jest.mock('../../middleware/monitor/id.js', () => (req, res) => res.send('monitor id executed'));
jest.mock('../../middleware/monitor/status.js', () => (req, res) => res.send('monitor status executed'));
jest.mock('../../middleware/monitor/pause.js', () => (req, res) => res.send('monitor pause executed'));

// 🔹 Import express, supertest, and the router after mocks
import express from 'express';
import request from 'supertest';
import monitorRouter from '../monitor.js'; // router to test

// 🔹 Setup Express app
const app = express();
app.use(express.json());
app.use('/api/monitor', monitorRouter); // register router

// ✅ Tests
describe('Monitor Router Tests', () => {
  test('GET /api/monitor/status', async () => {
    const res = await request(app).get('/api/monitor/status');
    expect(res.text).toBe('monitor status executed');
  });

  test('GET /api/monitor/id', async () => {
    const res = await request(app).get('/api/monitor/id');
    expect(res.text).toBe('monitor id executed');
  });

  test('POST /api/monitor/add', async () => {
    const res = await request(app).post('/api/monitor/add');
    expect(res.text).toBe('monitor add executed');
  });

  test('POST /api/monitor/edit', async () => {
    const res = await request(app).post('/api/monitor/edit');
    expect(res.text).toBe('monitor edit executed');
  });

  test('GET /api/monitor/delete', async () => {
    const res = await request(app).get('/api/monitor/delete');
    expect(res.text).toBe('monitor delete executed');
  });

  test('POST /api/monitor/pause', async () => {
    const res = await request(app).post('/api/monitor/pause');
    expect(res.text).toBe('monitor pause executed');
  });
});
