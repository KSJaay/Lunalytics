import { createRequest, createResponse } from 'node-mocks-http';
import { getUserByEmail } from '../../../../server/database/queries/user.js';
import { userSessionExists } from '../../../../server/database/queries/session.js';
import { fetchStatusPageUsingUrl } from '../../../../server/database/queries/status.js';
import getStatusPageUsingIdMiddleware from '../../../../server/middleware/status/statusPageUsingId.js';

vi.mock('../../../../server/database/queries/session.js');
vi.mock('../../../../server/database/queries/status.js');
vi.mock('../../../../server/database/queries/user.js');

describe('getStatusPageUsingIdMiddleware', () => {
  let fakeRequest, fakeResponse, fakeNext;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeNext = vi.fn();

    fakeResponse.redirect = vi.fn();
    getUserByEmail = vi.fn(() => true);

    fetchStatusPageUsingUrl = vi.fn((id) =>
      id === 'exists' ? { settings: { isPublic: true } } : null
    );

    userSessionExists = vi.fn(() => true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to / if id is default', async () => {
    fakeRequest.params = { id: 'default' };

    await getStatusPageUsingIdMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith('/');
  });

  it('should redirect to /404 if not found', async () => {
    fakeRequest.params = { id: 'notfound' };

    await getStatusPageUsingIdMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith('/404');
  });

  it('should call next if public', async () => {
    fakeRequest.params = { id: 'exists' };

    await getStatusPageUsingIdMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeNext).toHaveBeenCalled();
  });

  it('should redirect to /home if not public and no session', async () => {
    fetchStatusPageUsingUrl.mockResolvedValueOnce({
      settings: { isPublic: false },
    });
    userSessionExists.mockResolvedValueOnce(false);
    fakeRequest.params = { id: 'exists' };

    await getStatusPageUsingIdMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith('/home');
  });

  it('should redirect to /home if user not in db', async () => {
    fetchStatusPageUsingUrl.mockResolvedValueOnce({
      settings: { isPublic: false },
    });
    userSessionExists.mockResolvedValueOnce({ email: 'test' });
    getUserByEmail.mockResolvedValueOnce(false);
    fakeRequest.params = { id: 'exists' };

    await getStatusPageUsingIdMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith('/home');
  });

  it('should redirect to /404 on error', async () => {
    fetchStatusPageUsingUrl.mockImplementationOnce(() => {
      throw new Error('fail');
    });
    fakeRequest.params = { id: 'exists' };

    await getStatusPageUsingIdMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.redirect).toHaveBeenCalledWith('/404');
  });
});
