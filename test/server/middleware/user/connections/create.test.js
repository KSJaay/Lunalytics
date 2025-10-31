import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
vi.mock('../../../../../server/utils/errors.js');
vi.mock('../../../../../server/database/queries/connection.js');

import { handleError } from '../../../../../server/utils/errors.js';
import { createConnection } from '../../../../../server/database/queries/connection.js';
import createConnectionMiddleware from '../../../../../server/middleware/user/connections/create.js';

describe('createConnectionMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeResponse.locals = { user: { email: 'test@example.com' } };
    createConnection = vi.fn(() => Promise.resolve());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create connection', async () => {
    fakeRequest.body = { provider: 'github' };

    await createConnectionMiddleware(fakeRequest, fakeResponse);

    expect(createConnection).toHaveBeenCalledWith('test@example.com', {
      provider: 'github',
    });
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if error thrown', async () => {
    createConnection.mockImplementationOnce(() => {
      throw new Error('fail');
    });
    fakeRequest.body = { provider: 'github' };

    await createConnectionMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
