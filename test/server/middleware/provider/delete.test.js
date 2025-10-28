import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
vi.mock('../../../../server/utils/errors.js', () => ({ handleError: vi.fn() }));
vi.mock('../../../../server/database/queries/provider.js', () => ({
  deleteProvider: vi.fn(() => Promise.resolve()),
}));

import deleteProviderMiddleware from '../../../../server/middleware/provider/delete.js';
import { handleError } from '../../../../server/utils/errors.js';
import { deleteProvider } from '../../../../server/database/queries/provider.js';

describe('deleteProviderMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call deleteProvider with provider from body', async () => {
    fakeRequest.body = { provider: 'github' };

    await deleteProviderMiddleware(fakeRequest, fakeResponse);

    expect(deleteProvider).toHaveBeenCalledWith('github');
  });

  it('should call handleError if error thrown', async () => {
    deleteProvider.mockImplementationOnce(() => {
      throw new Error('fail');
    });

    fakeRequest.body = { provider: 'github' };

    await deleteProviderMiddleware(fakeRequest, fakeResponse);
    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
