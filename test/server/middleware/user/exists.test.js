import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import { getUserByEmail } from '../../../../server/database/queries/user.js';
import userExistsMiddleware from '../../../../server/middleware/user/exists.js';

vi.mock('../../../../server/database/queries/user.js');
vi.mock('../../../../server/utils/errors.js');

describe('userExistsMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    getUserByEmail = vi.fn((email) =>
      email === 'exists@example.com' ? { email } : null
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if no email', async () => {
    fakeRequest.body = {};

    await userExistsMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse._getStatusCode()).toBe(400);
    expect(fakeResponse._getData()).toBe('No email provided');
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should return false if user not found', async () => {
    fakeRequest.body = { email: 'notfound@example.com' };

    await userExistsMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse._getData()).toBe('false');
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should return true if user found', async () => {
    fakeRequest.body = { email: 'exists@example.com' };

    await userExistsMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse._getData()).toBe('true');
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if error thrown', async () => {
    getUserByEmail.mockImplementationOnce(() => {
      throw new Error('fail');
    });
    fakeRequest.body = { email: 'exists@example.com' };

    await userExistsMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
