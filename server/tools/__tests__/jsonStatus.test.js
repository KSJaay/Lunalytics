// Polyfill setImmediate for Jest
if (typeof setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// 🔹 Mock dependencies
jest.mock('axios', () => ({
  request: jest.fn(),
}));

jest.mock('jsonata', () => {
  return jest.fn(() => ({
    evaluate: jest.fn(),
  }));
});

jest.mock('../../utils/logger.js', () => ({
  error: jest.fn(),
}));

jest.mock('../../../shared/utils/object.js', () => ({
  isEmpty: jest.fn((obj) => !obj || Object.keys(obj).length === 0),
}));

// 🔹 Import modules after mocks
import axios from 'axios';
import jsonata from 'jsonata';
import jsonStatusCheck from '../jsonStatus.js';
import logger from '../../utils/logger.js';

describe('jsonStatus.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const monitorBase = {
    monitorId: 'm1',
    url: 'http://example.com',
    method: 'GET',
    requestTimeout: 5,
  };

  test('returns JSON Query successful when query passes', async () => {
    axios.request.mockResolvedValueOnce({
      status: 200,
      data: { key: 10 },
    });
    jsonata.mockImplementationOnce(() => ({
      evaluate: jest.fn().mockResolvedValueOnce(true),
    }));

    const monitor = { ...monitorBase, json_query: [{ key: 'key', operator: '==', value: '10' }] };
    const result = await jsonStatusCheck(monitor);

    expect(result).toEqual({
      monitorId: monitor.monitorId,
      status: 200,
      isDown: false,
      message: 'JSON Query successful',
      latency: expect.any(Number),
    });
  });

  test('returns JSON Query failed when query fails', async () => {
    axios.request.mockResolvedValueOnce({
      status: 200,
      data: { key: 5 },
    });
    jsonata.mockImplementationOnce(() => ({
      evaluate: jest.fn().mockResolvedValueOnce(false),
    }));

    const monitor = { ...monitorBase, json_query: [{ key: 'key', operator: '==', value: '10' }] };
    const result = await jsonStatusCheck(monitor);

    expect(result).toEqual({
      monitorId: monitor.monitorId,
      status: 200,
      isDown: true,
      message: 'JSON Query failed',
      latency: expect.any(Number),
    });
  });

  test('handles axios request exception without response', async () => {
    axios.request.mockRejectedValueOnce(new Error('Network Error'));

    const result = await jsonStatusCheck(monitorBase);

    expect(result).toEqual({
      monitorId: monitorBase.monitorId,
      status: 0,
      isDown: true,
      message: 'Network Error',
      latency: expect.any(Number),
    });
    expect(logger.error).toHaveBeenCalled();
  });

  test('returns true when no json_query is provided', async () => {
    axios.request.mockResolvedValueOnce({ status: 200, data: {} });

    const result = await jsonStatusCheck({ ...monitorBase, json_query: [] });

    expect(result).toEqual({
      monitorId: monitorBase.monitorId,
      status: 200,
      isDown: true,
      message: 'JSON Query failed',
      latency: expect.any(Number),
    });
  });
});
