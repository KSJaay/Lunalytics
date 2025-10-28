import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import { apiTokenDelete } from '../../../../server/database/queries/tokens.js';
import deleteApiTokenMiddleware from '../../../../server/middleware/tokens/delete.js';

vi.mock('../../../../server/database/queries/tokens.js');
vi.mock('../../../../server/utils/errors.js');

describe('deleteApiTokenMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    apiTokenDelete = vi.fn(() => Promise.resolve());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if no token', async () => {
    fakeRequest.body = {};
    await deleteApiTokenMiddleware(fakeRequest, fakeResponse);
    expect(fakeResponse._getStatusCode()).toBe(400);
    expect(fakeResponse._getData()).toEqual(
      expect.objectContaining({ message: 'Token is required' })
    );
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should delete token and return 200', async () => {
    fakeRequest.body = { token: 't' };
    await deleteApiTokenMiddleware(fakeRequest, fakeResponse);
    expect(apiTokenDelete).toHaveBeenCalledWith('t');
    expect(fakeResponse._getStatusCode()).toBe(200);
    expect(fakeResponse._getData()).toEqual(
      expect.objectContaining({ message: 'Token deleted successfully' })
    );
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if error thrown', async () => {
    apiTokenDelete.mockImplementationOnce(() => {
      throw new Error('fail');
    });
    fakeRequest.body = { token: 't' };
    await deleteApiTokenMiddleware(fakeRequest, fakeResponse);
    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
