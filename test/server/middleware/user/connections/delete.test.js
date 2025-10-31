import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../../server/utils/errors.js';
import { deleteConnection } from '../../../../../server/database/queries/connection.js';
import deleteConnectionMiddleware from '../../../../../server/middleware/user/connections/delete.js';

vi.mock('../../../../../server/database/queries/connection.js');
vi.mock('../../../../../server/utils/errors.js');

describe('deleteConnectionMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeResponse.locals = { user: { email: 'test@example.com' } };
    deleteConnection = vi.fn(() => Promise.resolve());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if no provider', async () => {
    fakeRequest.body = {};

    await deleteConnectionMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse._getStatusCode()).toBe(400);
    expect(fakeResponse._getJSONData()).toEqual({
      error: 'Provider is required',
    });
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should delete connection and return 204', async () => {
    fakeRequest.body = { provider: 'github' };

    await deleteConnectionMiddleware(fakeRequest, fakeResponse);

    expect(deleteConnection).toHaveBeenCalledWith('test@example.com', 'github');
    expect(fakeResponse._getStatusCode()).toBe(204);
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if error thrown', async () => {
    deleteConnection.mockImplementationOnce(() => {
      throw new Error('fail');
    });
    fakeRequest.body = { provider: 'github' };

    await deleteConnectionMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
