import { createRequest, createResponse } from 'node-mocks-http';
import { deleteCookie } from '../../../../shared/utils/cookies';
import logout from '../../../../server/middleware/auth/logout';
import { createURL } from '../../../../shared/utils/url';

vi.mock('../../../../shared/utils/cookies');

describe('Logout - Middleware', () => {
  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    deleteCookie = vi.fn();
    fakeResponse.redirect = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call deleteCookie with response and "session_token"', async () => {
    await logout(fakeRequest, fakeResponse);

    expect(deleteCookie).toHaveBeenCalledWith(fakeResponse, 'session_token');
  });

  it('should redirect to /login', async () => {
    await logout(fakeRequest, fakeResponse);

    expect(fakeResponse.redirect).toHaveBeenCalledWith(createURL('/login'));
  });
});
