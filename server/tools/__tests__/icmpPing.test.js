// Polyfill setImmediate for Jest
if (typeof setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// 🔹 Create a global logger mock
global.logger = {
  error: jest.fn(),
};

// 🔹 Mock ping
jest.mock('ping', () => ({
  promise: {
    probe: jest.fn(),
  },
}));

// 🔹 Import modules after global mocks
import ping from 'ping';
import pingStatusCheck from '../icmpPing.js';

describe('icmpPing.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const monitorBase = {
    monitorId: 'm1',
    url: 'example.com',
    requestTimeout: 5000,
  };

  test('returns isDown false if ping succeeds', async () => {
    ping.promise.probe.mockResolvedValueOnce({ alive: true });

    const result = await pingStatusCheck(monitorBase);
    expect(result.monitorId).toBe(monitorBase.monitorId);
    expect(result.status).toBe(200);
    expect(result.message).toBe('Up and running!');
    expect(result.isDown).toBe(false);
  });

  test('returns isDown true if ping fails', async () => {
    ping.promise.probe.mockResolvedValueOnce({ alive: false });

    const result = await pingStatusCheck(monitorBase);
    expect(result.monitorId).toBe(monitorBase.monitorId);
    expect(result.status).toBe(200);
    expect(result.message).toBe('Ping timed out!');
    expect(result.isDown).toBe(true);
  });

  test('handles exceptions and returns isDown true', async () => {
    ping.promise.probe.mockRejectedValueOnce(new Error('Network Error'));

    const result = await pingStatusCheck(monitorBase);
    expect(result.monitorId).toBe(monitorBase.monitorId);
    expect(result.status).toBe(200);
    expect(result.message).toBe('Ping timed out!');
    expect(result.isDown).toBe(true);
    expect(global.logger.error).toHaveBeenCalled();
  });

  test('calculates timeout correctly from requestTimeout', async () => {
    const monitor = { ...monitorBase, requestTimeout: 3000 };
    ping.promise.probe.mockResolvedValueOnce({ alive: true });

    await pingStatusCheck(monitor);
    expect(ping.promise.probe).toHaveBeenCalledWith(
      monitor.url,
      expect.objectContaining({ timeout: 3 })
    );
  });

  test('defaults timeout to 5000ms if not specified', async () => {
    const monitor = { monitorId: 'm2', url: 'example.com' };
    ping.promise.probe.mockResolvedValueOnce({ alive: true });

    await pingStatusCheck(monitor);
    expect(ping.promise.probe).toHaveBeenCalledWith(
      monitor.url,
      expect.objectContaining({ timeout: 5 })
    );
  });
});
