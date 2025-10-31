import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import fetchUserMiddleware from '../../../../server/middleware/user/user.js';

vi.mock('../../../../server/utils/errors.js');

describe('fetchUserMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeResponse.locals = { user: { email: 'test@example.com', name: 'Test' } };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return user from res.locals', async () => {
    await fetchUserMiddleware(fakeRequest, fakeResponse);
    expect(fakeResponse._getData()).toEqual({
      email: 'test@example.com',
      name: 'Test',
    });
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if error thrown', async () => {
    fakeResponse.locals = null;

    await fetchUserMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
