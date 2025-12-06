// Polyfill setImmediate for Jest
if (typeof setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// 🔹 Mock all user-related middleware
jest.mock('../../middleware/user/user.js', () => jest.fn((req, res) => res.send('fetch user executed')));
jest.mock('../../middleware/user/exists.js', () => jest.fn((req, res) => res.send('user exists executed')));
jest.mock('../../middleware/user/monitors.js', () => jest.fn((req, res) => res.send('user monitors executed')));
jest.mock('../../middleware/user/update/username.js', () => jest.fn((req, res) => res.send('update username executed')));
jest.mock('../../middleware/user/update/password.js', () => jest.fn((req, res) => res.send('update password executed')));
jest.mock('../../middleware/user/update/avatar.js', () => jest.fn((req, res) => res.send('update avatar executed')));
jest.mock('../../middleware/user/team/members.js', () => jest.fn((req, res) => res.send('team members executed')));
jest.mock('../../middleware/user/connections/getAll.js', () => jest.fn((req, res) => res.send('get all connections executed')));
jest.mock('../../middleware/user/connections/create.js', () => jest.fn((req, res) => res.send('create connection executed')));
jest.mock('../../middleware/user/connections/delete.js', () => jest.fn((req, res) => res.send('delete connection executed')));
jest.mock('../../middleware/user/access/declineUser.js', () => jest.fn((req, res) => res.send('access decline executed')));
jest.mock('../../middleware/user/access/approveUser.js', () => jest.fn((req, res) => res.send('access approve executed')));
jest.mock('../../middleware/user/access/removeUser.js', () => jest.fn((req, res) => res.send('access remove executed')));
jest.mock('../../middleware/user/permission/update.js', () => jest.fn((req, res) => res.send('permission update executed')));
jest.mock('../../middleware/user/transferOwnership.js', () => jest.fn((req, res) => res.send('transfer ownership executed')));
jest.mock('../../middleware/user/deleteAccount.js', () => jest.fn((req, res) => res.send('delete account executed')));

// 🔹 Mock permissions middleware
jest.mock('../../middleware/user/hasPermission.js', () => ({
  hasRequiredPermission: () => (req, res, next) => next(),
}));

// 🔹 Import dependencies after mocks
import express from 'express';
import request from 'supertest';
import userRouter from '../user.js';

// 🔹 Setup Express app
const app = express();
app.use(express.json());
app.use('/api/user', userRouter);

// ✅ Tests
describe('User Router', () => {
  test('GET /api/user -> fetchUserMiddleware', async () => {
    const res = await request(app).get('/api/user');
    expect(res.text).toBe('fetch user executed');
  });

  test('POST /api/user/exists -> userExistsMiddleware', async () => {
    const res = await request(app).post('/api/user/exists');
    expect(res.text).toBe('user exists executed');
  });

  test('GET /api/user/monitors -> userMonitorsMiddleware', async () => {
    const res = await request(app).get('/api/user/monitors');
    expect(res.text).toBe('user monitors executed');
  });

  test('POST /api/user/update/username -> userUpdateUsername', async () => {
    const res = await request(app).post('/api/user/update/username');
    expect(res.text).toBe('update username executed');
  });

  test('POST /api/user/update/password -> userUpdatePassword', async () => {
    const res = await request(app).post('/api/user/update/password');
    expect(res.text).toBe('update password executed');
  });

  test('POST /api/user/update/avatar -> userUpdateAvatar', async () => {
    const res = await request(app).post('/api/user/update/avatar');
    expect(res.text).toBe('update avatar executed');
  });

  test('GET /api/user/team -> teamMembersListMiddleware', async () => {
    const res = await request(app).get('/api/user/team');
    expect(res.text).toBe('team members executed');
  });

  test('GET /api/user/connections -> getAllConnectionMiddleware', async () => {
    const res = await request(app).get('/api/user/connections');
    expect(res.text).toBe('get all connections executed');
  });

  test('POST /api/user/connection/create -> createConnectionMiddleware', async () => {
    const res = await request(app).post('/api/user/connection/create');
    expect(res.text).toBe('create connection executed');
  });

  test('POST /api/user/connection/delete -> deleteConnectionMiddleware', async () => {
    const res = await request(app).post('/api/user/connection/delete');
    expect(res.text).toBe('delete connection executed');
  });

  test('POST /api/user/access/decline -> accessDeclineMiddleware', async () => {
    const res = await request(app).post('/api/user/access/decline');
    expect(res.text).toBe('access decline executed');
  });

  test('POST /api/user/access/approve -> accessApproveMiddleware', async () => {
    const res = await request(app).post('/api/user/access/approve');
    expect(res.text).toBe('access approve executed');
  });

  test('POST /api/user/access/remove -> accessRemoveMiddleware', async () => {
    const res = await request(app).post('/api/user/access/remove');
    expect(res.text).toBe('access remove executed');
  });

  test('POST /api/user/permission/update -> permissionUpdateMiddleware', async () => {
    const res = await request(app).post('/api/user/permission/update');
    expect(res.text).toBe('permission update executed');
  });

  test('POST /api/user/transfer/ownership -> transferOwnershipMiddleware', async () => {
    const res = await request(app).post('/api/user/transfer/ownership');
    expect(res.text).toBe('transfer ownership executed');
  });

  test('POST /api/user/delete/account -> deleteAccountMiddleware', async () => {
    const res = await request(app).post('/api/user/delete/account');
    expect(res.text).toBe('delete account executed');
  });
});
