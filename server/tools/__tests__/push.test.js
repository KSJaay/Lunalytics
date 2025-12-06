// Polyfill setImmediate for Jest
if (typeof setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// 🔹 Mock dependencies
jest.mock('../../utils/logger.js', () => ({
  error: jest.fn(),
}));

jest.mock('../../database/queries/heartbeat.js', () => ({
  fetchHeartbeats: jest.fn(),
}));

// 🔹 Import modules after mocks
import logger from '../../utils/logger.js';
import { fetchHeartbeats } from '../../database/queries/heartbeat.js';
import pushStatusCheck from '../push.js';

describe('pushStatusCheck', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const monitorBase = {
    monitorId: 'm1',
    interval: 5, // seconds
  };

  test('returns false when heartbeat is recent', async () => {
    const now = Date.now();
    fetchHeartbeats.mockResolvedValueOnce([
      { date: new Date(now - 1000).toISOString() },
    ]);

    const result = await pushStatusCheck(monitorBase);

    expect(result).toBe(false);
  });

  test('returns object with isDown true when heartbeat expired', async () => {
    const pastDate = new Date(Date.now() - 10 * 1000).toISOString(); // 10s ago
    fetchHeartbeats.mockResolvedValueOnce([{ date: pastDate }]);

    const result = await pushStatusCheck(monitorBase);

    expect(result).toEqual({
      monitorId: monitorBase.monitorId,
      status: 'Unknown',
      latency: expect.any(Number),
      message: 'No PUSH notification received',
      isDown: true,
    });
  });

  test('handles empty heartbeat array as down', async () => {
    fetchHeartbeats.mockResolvedValueOnce([]);

    const result = await pushStatusCheck(monitorBase);

    expect(result).toEqual({
      monitorId: monitorBase.monitorId,
      status: 'Unknown',
      latency: expect.any(Number),
      message: 'No PUSH notification received',
      isDown: true,
    });
  });

  test('handles fetchHeartbeats throwing an error', async () => {
    fetchHeartbeats.mockRejectedValueOnce(new Error('Database error'));

    const result = await pushStatusCheck(monitorBase);

    expect(result).toEqual({
      monitorId: monitorBase.monitorId,
      status: 'Unknown',
      latency: expect.any(Number),
      message: 'No PUSH notification received',
      isDown: true,
    });

    expect(logger.error).toHaveBeenCalledWith('PUSH Status Check', {
      message: expect.stringMatching(/Issue checking monitor m1: Database error/),
    });
  });

  test('uses default interval 0 if not provided', async () => {
    fetchHeartbeats.mockResolvedValueOnce([{ date: new Date().toISOString() }]);

    const monitorNoInterval = { monitorId: 'm2' };
    const result = await pushStatusCheck(monitorNoInterval);

    expect(result).toBe(false); // Because interval = 0 means no expiry
  });
});
