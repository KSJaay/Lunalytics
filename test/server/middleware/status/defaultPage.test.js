import { createRequest, createResponse } from 'node-mocks-http';
import { getUserByEmail } from '../../../../server/database/queries/user.js';
import { userSessionExists } from '../../../../server/database/queries/session.js';
import { fetchStatusPageUsingUrl } from '../../../../server/database/queries/status.js';
import defaultPageMiddleware from '../../../../server/middleware/status/defaultPage.js';

vi.mock('../../../../shared/utils/cookies.js');
vi.mock('../../../../server/database/queries/session.js');
vi.mock('../../../../server/database/queries/status.js');
vi.mock('../../../../server/database/queries/user.js');

describe('defaultPageMiddleware', () => {
  let fakeRequest, fakeResponse, fakeNext;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeNext = vi.fn();

    userSessionExists = vi.fn(function () {
      return true;
    });
    fetchStatusPageUsingUrl = vi.fn(function () {
      return Promise.resolve({
        settings: JSON.stringify({ isPublic: true }),
      });
    });
    getUserByEmail = vi.fn(function () {
      return true;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to /home if no statusPage', async () => {
    fetchStatusPageUsingUrl.mockResolvedValueOnce(null);
    fakeResponse.redirect = vi.fn();

    await defaultPageMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith('/home');
  });

  it('should call next if public', async () => {
    await defaultPageMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeNext).toHaveBeenCalled();
  });

  it('should redirect to /home if not public and no session', async () => {
    fetchStatusPageUsingUrl.mockResolvedValueOnce({
      settings: JSON.stringify({ isPublic: false }),
    });

    userSessionExists.mockResolvedValueOnce(false);
    fakeResponse.redirect = vi.fn();

    await defaultPageMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith('/home');
  });

  it('should redirect to /home if user not in db', async () => {
    fetchStatusPageUsingUrl.mockResolvedValueOnce({
      settings: JSON.stringify({ isPublic: false }),
    });

    userSessionExists.mockResolvedValueOnce({ email: 'test' });
    getUserByEmail.mockResolvedValueOnce(false);
    fakeResponse.redirect = vi.fn();

    await defaultPageMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith('/home');
  });

  it('should redirect to /home on error', async () => {
    fetchStatusPageUsingUrl.mockImplementationOnce(() => {
      throw new Error('fail');
    });

    fakeResponse.redirect = vi.fn();

    await defaultPageMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith('/home');
  });
});
