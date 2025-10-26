import { createRequest, createResponse } from 'node-mocks-http';
import cache from '../../../../server/cache/index.js';
import statusCache from '../../../../server/cache/status.js';
import { handleError } from '../../../../server/utils/errors.js';
import monitorPause from '../../../../server/middleware/monitor/pause.js';
import { pauseMonitor } from '../../../../server/database/queries/monitor.js';

vi.mock('../../../../server/cache/index.js');
vi.mock('../../../../server/cache/status.js');
vi.mock('../../../../server/database/queries/monitor.js');
vi.mock('../../../../server/utils/errors.js');

describe('monitorPause middleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeResponse.sendStatus = vi.fn().mockReturnThis();
    statusCache.reloadMonitor = vi
      .fn()
      .mockImplementation(() => Promise.resolve(true));
  });

  afterEach(() => {
    vi.clearAllMocks();
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
    fakeRequest.body = { monitorId: 'abc', pause: 'true' };

    await monitorPause(fakeRequest, fakeResponse);

    expect(pauseMonitor).toHaveBeenCalledWith('abc', true);
    expect(cache.removeMonitor).toHaveBeenCalledWith('abc');

    fakeRequest.body = { monitorId: 'abc', pause: 'false' };
    await monitorPause(fakeRequest, fakeResponse);

    expect(pauseMonitor).toHaveBeenCalledWith('abc', false);
    expect(cache.checkStatus).toHaveBeenCalledWith('abc');
  });

  it('should handle error thrown by pauseMonitor', async () => {
    pauseMonitor.mockImplementationOnce(() => {
      throw new Error('db error');
    });

    fakeRequest.body = { monitorId: 'abc', pause: true };

    await monitorPause(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
    expect(handleError.mock.calls[0][0].message).toMatch(/db error/);
    expect(fakeResponse.sendStatus).not.toHaveBeenCalled();
  });

  it('should not throw if statusCache.reloadMonitor rejects', async () => {
    statusCache.reloadMonitor.mockImplementationOnce(() =>
      Promise.reject(new Error('reload error'))
    );

    fakeRequest.body = { monitorId: 'abc', pause: true };

    await monitorPause(fakeRequest, fakeResponse);

    expect(fakeResponse.sendStatus).toHaveBeenCalledWith(200);
    expect(handleError).not.toHaveBeenCalled();
  });
});
