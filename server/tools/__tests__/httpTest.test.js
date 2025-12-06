// Polyfill setImmediate for Jest
if (typeof setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// 🔹 Mock dependencies
jest.mock('axios');
jest.mock('https', () => ({
  Agent: jest.fn(),
}));
jest.mock('../../utils/logger.js', () => ({
  error: jest.fn(),
}));

// 🔹 Import modules after mocks
import axios from 'axios';
import httpStatusCheck from '../httpStatus.js';
import logger from '../../utils/logger.js';

describe('httpStatus.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const monitorBase = {
    monitorId: 'm1',
    url: 'https://example.com',
    method: 'GET',
    requestTimeout: 1, // in seconds
    valid_status_codes: ['200', '201-202'],
    headers: {},
    body: {},
    ignoreTls: false,
  };

  test('returns proper status for a successful response', async () => {
    axios.request.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
    });

    const result = await httpStatusCheck({ ...monitorBase });
    expect(result.monitorId).toBe(monitorBase.monitorId);
    expect(result.status).toBe(200);
    expect(result.message).toBe('200 - OK');
    expect(result.isDown).toBe(false);
  });

  test('returns isDown true for status outside valid_status_codes', async () => {
    axios.request.mockResolvedValueOnce({
      status: 500,
      statusText: 'Internal Server Error',
    });

    const result = await httpStatusCheck({ ...monitorBase });
    expect(result.isDown).toBe(true);
    expect(result.message).toBe('500 - Internal Server Error');
  });

  test('handles axios error with response', async () => {
    axios.request.mockRejectedValueOnce({
      response: { status: 404, statusText: 'Not Found' },
      message: 'Request failed',
    });

    const result = await httpStatusCheck({ ...monitorBase });
    expect(result.status).toBe(404);
    expect(result.message).toBe('404 - Not Found');
    expect(result.isDown).toBe(true);
    expect(logger.error).toHaveBeenCalled();
  });

  test('handles axios error without response', async () => {
    axios.request.mockRejectedValueOnce(new Error('Network Error'));

    const result = await httpStatusCheck({ ...monitorBase });
    expect(result.status).toBe(0);
    expect(result.isDown).toBe(true);
    expect(result.message).toBe('Network Error');
    expect(logger.error).toHaveBeenCalled();
  });

  test('sets https agent when ignoreTls is true', async () => {
    axios.request.mockResolvedValueOnce({ status: 200, statusText: 'OK' });

    await httpStatusCheck({ ...monitorBase, ignoreTls: true });
    expect(require('https').Agent).toHaveBeenCalledWith({ rejectUnauthorized: false });
  });

  test('includes headers and body if provided', async () => {
    axios.request.mockResolvedValueOnce({ status: 200, statusText: 'OK' });

    const monitor = {
      ...monitorBase,
      headers: { Authorization: 'Bearer token' },
      body: { key: 'value' },
    };

    await httpStatusCheck(monitor);
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: monitor.headers,
        data: monitor.body,
      })
    );
  });
});
