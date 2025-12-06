// Polyfill setImmediate for Jest
if (typeof setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// 🔹 Mock all dependencies
jest.mock('../../database/queries/status.js', () => ({
  fetchStatusPageUsingUrl: jest.fn(),
}));

jest.mock('../../database/queries/session.js', () => ({
  userSessionExists: jest.fn(),
}));

jest.mock('../../database/queries/user.js', () => ({
  getUserByEmail: jest.fn(),
}));

jest.mock('../../utils/errors.js', () => ({
  handleError: jest.fn((err, res) => res.status(500).send('internal error')),
}));

jest.mock('../../class/status.js', () => ({
  cleanStatusApiResponse: jest.fn((payload) => payload),
  cleanStatusPage: jest.fn((status) => status),
}));

jest.mock('../../cache/status.js', () => ({
  fetchStatusPage: jest.fn(() => ({ id: 'mocked-status' })),
}));

// 🔹 Import dependencies after mocks
import express from 'express';
import request from 'supertest';
import statusApiRouter from '../statusApi.js';
import { fetchStatusPageUsingUrl } from '../../database/queries/status.js';
import { userSessionExists } from '../../database/queries/session.js';
import { getUserByEmail } from '../../database/queries/user.js';
import { cleanStatusApiResponse, cleanStatusPage } from '../../class/status.js';
import statusCache from '../../cache/status.js';
import cookieParser from 'cookie-parser'; // Needed for req.cookies

// 🔹 Setup Express app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/', statusApiRouter);

describe('Status API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 400 if statusPageId is missing', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('statusPageId is required');
  });

  test('returns 404 if status not found', async () => {
    fetchStatusPageUsingUrl.mockResolvedValueOnce(null);

    const res = await request(app).get('/').query({ statusPageId: '123' });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('status not found');
  });

  test('returns 401 if page is private and no session or authorization', async () => {
    fetchStatusPageUsingUrl.mockResolvedValueOnce({
      statusId: '123',
      settings: { isPublic: false },
    });

    const res = await request(app).get('/').query({ statusPageId: '123' });
    expect(res.status).toBe(401);
  });

  test('returns status payload for public page', async () => {
    const mockStatus = { statusId: '123', settings: { isPublic: true } };
    fetchStatusPageUsingUrl.mockResolvedValueOnce(mockStatus);
    statusCache.fetchStatusPage = jest.fn(() => ({ id: 'mocked-status' }));

    const res = await request(app).get('/').query({ statusPageId: '123' });
    expect(res.status).toBe(200);
    expect(cleanStatusApiResponse).toHaveBeenCalled();
    expect(res.body).toEqual({ id: 'mocked-status' });
  });

  test('calls handleError on exception', async () => {
    fetchStatusPageUsingUrl.mockImplementationOnce(() => { throw new Error('oops'); });

    const res = await request(app).get('/').query({ statusPageId: '123' });
    expect(res.status).toBe(500);
    expect(res.text).toBe('internal error');
  });
});
