// Polyfill setImmediate for Jest
if (typeof setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// 🔹 Mock dependencies
jest.mock('http', () => ({
  request: jest.fn(),
}));

jest.mock('../../utils/logger.js', () => ({
  error: jest.fn(),
}));

// 🔹 Import module after mocks
import http from 'http';
import dockerStatusCheck, { getListOfDockerContainers } from '../docker.js';
import logger from '../../utils/logger.js';

describe('docker.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockResponse = (data) => {
    return {
      on: jest.fn((event, callback) => {
        if (event === 'data') callback(JSON.stringify(data));
        if (event === 'end') callback();
      }),
    };
  };

  const createMockRequest = (res) => {
    return {
      on: jest.fn(),
      end: jest.fn(),
    };
  };

  test('dockerStatusCheck returns status when container is running', async () => {
    const monitor = { monitorId: 'm1', url: 'container1' };
    const containerData = {
      State: { Running: true, Status: 'running', Health: { Status: 'healthy' } },
    };

    http.request.mockImplementation((options, callback) => {
      const res = createMockResponse(containerData);
      callback(res);
      return createMockRequest(res);
    });

    const result = await dockerStatusCheck(monitor);
    expect(result.monitorId).toBe(monitor.monitorId);
    expect(result.status).toBe('healthy');
    expect(result.isDown).toBe(false);
    expect(result.message).toBe('Container is running');
  });

  test('dockerStatusCheck returns isDown true when container is not running', async () => {
    const monitor = { monitorId: 'm2', url: 'container2' };
    const containerData = { State: { Running: false, Status: 'exited' } };

    http.request.mockImplementation((options, callback) => {
      const res = createMockResponse(containerData);
      callback(res);
      return createMockRequest(res);
    });

    const result = await dockerStatusCheck(monitor);
    expect(result.isDown).toBe(true);
    expect(result.message).toBe('Container state: exited');
  });

  test('dockerStatusCheck handles request error', async () => {
    const monitor = { monitorId: 'm3', url: 'container3' };

    http.request.mockImplementation(() => {
      const req = createMockRequest({});
      req.on.mockImplementationOnce((event, cb) => {
        if (event === 'error') cb(new Error('network error'));
      });
      return req;
    });

    const result = await dockerStatusCheck(monitor);
    expect(result.isDown).toBe(true);
    expect(result.status).toBe('down');
    expect(result.message).toBe('Unknown container state');
    expect(logger.error).toHaveBeenCalled();
  });

  test('getListOfDockerContainers returns container list', async () => {
    const containers = [{ Id: 'c1' }, { Id: 'c2' }];

    http.request.mockImplementation((options, callback) => {
      const res = createMockResponse(containers);
      callback(res);
      return createMockRequest(res);
    });

    const result = await getListOfDockerContainers();
    expect(result).toEqual(containers);
  });

  test('getListOfDockerContainers handles error and returns empty array', async () => {
    http.request.mockImplementation(() => {
      const req = createMockRequest({});
      req.on.mockImplementationOnce((event, cb) => {
        if (event === 'error') cb(new Error('docker error'));
      });
      return req;
    });

    const result = await getListOfDockerContainers();
    expect(result).toEqual([]);
    expect(logger.error).toHaveBeenCalled();
  });
});
