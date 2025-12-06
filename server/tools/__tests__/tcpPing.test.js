// Polyfill setImmediate for Jest
if (typeof setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// 🔹 Mock dependencies
jest.mock('../../utils/logger.js', () => ({
  error: jest.fn(),
}));

import logger from '../../utils/logger.js';
import tcpStatusCheck from '../tcpPing.js';
import net from 'net';

describe('tcpStatusCheck', () => {
  let monitor;
  let callback;
  let socketInstance;

  // Mock net.Socket so we can control the instance
  class MockSocket {
    constructor() {
      socketInstance = this;
      this.events = {};
    }
    setTimeout(timeout, cb) {
      this.timeoutCb = cb;
    }
    connect(port, address, cb) {
      this.connectCb = cb;
    }
    destroy() {
      this.destroyed = true;
    }
    on(event, cb) {
      this.events[event] = cb;
    }
    emit(event, ...args) {
      if (this.events[event]) this.events[event](...args);
    }
  }

  beforeAll(() => {
    jest.spyOn(net, 'Socket').mockImplementation(() => new MockSocket());
  });

  beforeEach(() => {
    jest.clearAllMocks();
    monitor = {
      monitorId: 'm1',
      url: '127.0.0.1',
      port: 8080,
      requestTimeout: 1, // seconds
    };
    callback = jest.fn();
    socketInstance = null;
  });

  test('calls callback with success when connection succeeds', () => {
    tcpStatusCheck(monitor, callback);
    // simulate successful connect
    socketInstance.connectCb?.();

    expect(callback).toHaveBeenCalled();
    const [mon, result] = callback.mock.calls[0];
    expect(mon).toBe(monitor);
    expect(result.monitorId).toBe('m1');
    expect(result.status).toBe(200);
    expect(result.isDown).toBe(false);
    expect(result.message).toBe('Up and running!');
  });

  test('calls callback with error when socket emits error', () => {
    tcpStatusCheck(monitor, callback);
    const error = new Error('Connection refused');

    socketInstance.emit('error', error);

    expect(logger.error).toHaveBeenCalledWith('TCP Status Check', {
      message: `Issue checking monitor m1: ${error.message}`,
    });

    expect(callback).toHaveBeenCalled();
    const [mon, result] = callback.mock.calls[0];
    expect(result.isDown).toBe(true);
    expect(result.status).toBe(503);
    expect(result.message).toBe('Connection refused');
  });

  test('calls callback with timeout when socket times out', () => {
    tcpStatusCheck(monitor, callback);

    // simulate timeout
    socketInstance.timeoutCb?.();

    expect(logger.error).toHaveBeenCalledWith('TCP Status Check', {
      message: 'Issue checking monitor m1: TIMED OUT',
    });

    expect(callback).toHaveBeenCalled();
    const [mon, result] = callback.mock.calls[0];
    expect(result.isDown).toBe(true);
    expect(result.status).toBe(504);
    expect(result.message).toBe('Ping timed out!');
  });

  test('uses default port 80 and address 127.0.0.1 if not provided', () => {
    const monitorNoPort = { monitorId: 'm2', requestTimeout: 1 };
    tcpStatusCheck(monitorNoPort, callback);

    // simulate successful connect
    socketInstance.connectCb?.();

    const [mon, result] = callback.mock.calls[0];
    expect(result.status).toBe(200);
    expect(result.isDown).toBe(false);
  });
});
