import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
vi.mock('../../../../../server/database/queries/connection.js', () => ({
  fetchConnections: vi.fn(() => Promise.resolve([{ provider: 'github' }])),
}));
vi.mock('../../../../../server/utils/errors.js', () => ({
  handleError: vi.fn(),
}));

import getAllConnectionMiddleware from '../../../../../server/middleware/user/connections/getAll.js';
import { handleError } from '../../../../../server/utils/errors.js';
import { fetchConnections } from '../../../../../server/database/queries/connection.js';

describe('getAllConnectionMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeResponse.locals = { user: { email: 'test@example.com' } };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch connections and return 200', async () => {
    await getAllConnectionMiddleware(fakeRequest, fakeResponse);

    expect(fetchConnections).toHaveBeenCalledWith('test@example.com');
    expect(fakeResponse._getStatusCode()).toBe(200);
    expect(fakeResponse._getJSONData()).toEqual([{ provider: 'github' }]);
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if error thrown', async () => {
    fetchConnections.mockImplementationOnce(() => {
      throw new Error('fail');
    });

    await getAllConnectionMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
