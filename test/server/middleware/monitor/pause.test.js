/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Cache (Main)
jest.mock('../../../../server/cache/index.js', () => ({
  __esModule: true,
  default: {
    removeMonitor: jest.fn(),
    checkStatus: jest.fn(),
  },
}));

// Mock Cache (Status)
jest.mock('../../../../server/cache/status.js', () => ({
  __esModule: true,
  default: {
    reloadMonitor: jest.fn(),
  },
}));

// Mock Database Queries (Monitor)
jest.mock('../../../../server/database/queries/monitor.js', () => ({
  pauseMonitor: jest.fn(),
}));

// Mock Error Handler
jest.mock('../../../../server/utils/errors.js', () => ({
  handleError: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import monitorPause from '../../../../server/middleware/monitor/pause.js';
import cache from '../../../../server/cache/index.js';
import statusCache from '../../../../server/cache/status.js';
import { handleError } from '../../../../server/utils/errors.js';
import { pauseMonitor } from '../../../../server/database/queries/monitor.js';

describe('monitorPause middleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    // Reset all mocks to ensure clean state between tests
    jest.clearAllMocks();

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    // Mock response methods
    fakeResponse.sendStatus = jest.fn().mockReturnThis();

    // Default successful returns (Async to prevent crashes)
    pauseMonitor.mockResolvedValue(true);
    statusCache.reloadMonitor.mockResolvedValue(true);
    cache.removeMonitor.mockImplementation(() => {});
    cache.checkStatus.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call handleError if monitorId is missing', async () => {
    fakeRequest.body = { pause: true };

    await monitorPause(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
    expect(handleError.mock.calls[0][0].message).toMatch(/No monitorId/);
    expect(fakeResponse.sendStatus).not.toHaveBeenCalled();
  });

  it('should call handleError if pause is not boolean-like', async () => {
    fakeRequest.body = { monitorId: 'abc', pause: 'notabool' };

    await monitorPause(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
    expect(handleError.mock.calls[0][0].message).toMatch(
      /Pause should be a boolean/
    );
    expect(fakeResponse.sendStatus).not.toHaveBeenCalled();
  });

  it('should pause the monitor and remove it from cache when pause is true', async () => {
    fakeRequest.body = { monitorId: 'abc', pause: true };

    await monitorPause(fakeRequest, fakeResponse);

    expect(pauseMonitor).toHaveBeenCalledWith('abc', true);
    expect(cache.removeMonitor).toHaveBeenCalledWith('abc');
    expect(cache.checkStatus).not.toHaveBeenCalled();
    expect(statusCache.reloadMonitor).toHaveBeenCalledWith('abc');
    expect(fakeResponse.sendStatus).toHaveBeenCalledWith(200);
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should unpause the monitor and check status when pause is false', async () => {
    fakeRequest.body = { monitorId: 'abc', pause: false };

    await monitorPause(fakeRequest, fakeResponse);

    expect(pauseMonitor).toHaveBeenCalledWith('abc', false);
    expect(cache.removeMonitor).not.toHaveBeenCalled();
    expect(cache.checkStatus).toHaveBeenCalledWith('abc');
    expect(statusCache.reloadMonitor).toHaveBeenCalledWith('abc');
    expect(fakeResponse.sendStatus).toHaveBeenCalledWith(200);
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should treat string "true" as true and string "false" as false', async () => {
    // Test "true"
    fakeRequest.body = { monitorId: 'abc', pause: 'true' };
    await monitorPause(fakeRequest, fakeResponse);
    expect(pauseMonitor).toHaveBeenCalledWith('abc', true);
    expect(cache.removeMonitor).toHaveBeenCalledWith('abc');

    // Clear mocks for next step
    jest.clearAllMocks();

    // Test "false"
    fakeRequest.body = { monitorId: 'abc', pause: 'false' };
    await monitorPause(fakeRequest, fakeResponse);
    expect(pauseMonitor).toHaveBeenCalledWith('abc', false);
    expect(cache.checkStatus).toHaveBeenCalledWith('abc');
  });

  it('should handle error thrown by pauseMonitor', async () => {
    pauseMonitor.mockRejectedValue(new Error('db error'));

    fakeRequest.body = { monitorId: 'abc', pause: true };

    await monitorPause(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
    expect(handleError.mock.calls[0][0].message).toMatch(/db error/);
    expect(fakeResponse.sendStatus).not.toHaveBeenCalled();
  });

  it('should not throw if statusCache.reloadMonitor rejects', async () => {
    // We mock a rejection here, but the middleware should swallow it or handle it gracefully
    statusCache.reloadMonitor.mockRejectedValue(new Error('reload error'));

    fakeRequest.body = { monitorId: 'abc', pause: true };

    await monitorPause(fakeRequest, fakeResponse);

    expect(fakeResponse.sendStatus).toHaveBeenCalledWith(200);
    expect(handleError).not.toHaveBeenCalled();
  });
});