// Polyfill setImmediate for Jest
if (typeof setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// 🔹 Mock permissions middleware
jest.mock('../../middleware/user/hasPermission.js', () => ({
  hasRequiredPermission: () => (req, res, next) => next(),
}));

// 🔹 Mock all notification middleware
jest.mock('../../middleware/notifications/create.js', () => (req, res) => res.send('notification create executed'));
jest.mock('../../middleware/notifications/edit.js', () => (req, res) => res.send('notification edit executed'));
jest.mock('../../middleware/notifications/getAll.js', () => (req, res) => res.send('notification getAll executed'));
jest.mock('../../middleware/notifications/getUsingId.js', () => (req, res) => res.send('notification getUsingId executed'));
jest.mock('../../middleware/notifications/delete.js', () => (req, res) => res.send('notification delete executed'));
jest.mock('../../middleware/notifications/disable.js', () => (req, res) => res.send('notification toggle executed'));
jest.mock('../../middleware/notifications/test.js', () => (req, res) => res.send('notification test executed'));

// 🔹 Import express, supertest, and the router after mocks
import express from 'express';
import request from 'supertest';
import notificationsRouter from '../notifications.js'; // router to test

// 🔹 Setup Express app
const app = express();
app.use(express.json());
app.use('/api/notifications', notificationsRouter); // register router

// ✅ Tests
describe('Notifications Router Tests', () => {
  test('GET /api/notifications', async () => {
    const res = await request(app).get('/api/notifications');
    expect(res.text).toBe('notification getAll executed');
  });

  test('GET /api/notifications/id', async () => {
    const res = await request(app).get('/api/notifications/id');
    expect(res.text).toBe('notification getUsingId executed');
  });

  test('POST /api/notifications/create', async () => {
    const res = await request(app).post('/api/notifications/create');
    expect(res.text).toBe('notification create executed');
  });

  test('POST /api/notifications/edit', async () => {
    const res = await request(app).post('/api/notifications/edit');
    expect(res.text).toBe('notification edit executed');
  });

  test('GET /api/notifications/delete', async () => {
    const res = await request(app).get('/api/notifications/delete');
    expect(res.text).toBe('notification delete executed');
  });

  test('GET /api/notifications/toggle', async () => {
    const res = await request(app).get('/api/notifications/toggle');
    expect(res.text).toBe('notification toggle executed');
  });

  test('POST /api/notifications/test', async () => {
    const res = await request(app).post('/api/notifications/test');
    expect(res.text).toBe('notification test executed');
  });
});
