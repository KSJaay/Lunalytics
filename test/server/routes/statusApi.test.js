import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import router from '../../../server/routes/statusApi.js';
import statusCache from '../../../server/cache/status.js';
import { apiTokenExists } from '../../../server/database/queries/tokens.js';
import { userSessionExists } from '../../../server/database/queries/session.js';
import { getUserByEmail } from '../../../server/database/queries/user.js';
import {
  fetchStatusPageUsingDomain,
  fetchStatusPageUsingUrl,
} from '../../../server/database/queries/status.js';

vi.mock('../../../server/database/queries/status.js');
vi.mock('../../../server/database/queries/session.js');
vi.mock('../../../server/database/queries/tokens.js');
vi.mock('../../../server/database/queries/user.js');
vi.mock('../../../server/cache/status.js', () => ({
  default: { fetchStatusPage: vi.fn() },
}));

const handler = router.stack.find((layer) => layer.route?.path === '/').route
  .stack[0].handle;

const dayMs = 24 * 60 * 60 * 1000;

const privatePage = {
  id: 1,
  statusId: 'private-id',
  statusUrl: 'private',
  settings: JSON.stringify({ isPublic: false }),
  layout: '[]',
};

const publicPage = {
  ...privatePage,
  statusUrl: 'public',
  settings: JSON.stringify({ isPublic: true }),
};

const payload = {
  id: 1,
  statusId: 'private-id',
  monitors: { m1: { name: 'Billing database' } },
  incidents: [],
  heartbeats: {},
};

const requestPage = async ({ statusPageId = 'private', cookies, headers }) => {
  const request = createRequest({
    method: 'GET',
    query: { statusPageId },
    cookies: cookies || {},
    headers: { host: 'status.example.com', ...(headers || {}) },
  });
  const response = createResponse();

  await handler(request, response);

  return response;
};

describe('Status API - private status pages', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    fetchStatusPageUsingDomain.mockResolvedValue(undefined);
    fetchStatusPageUsingUrl.mockImplementation(async (url) =>
      url === 'public' ? publicPage : url === 'private' ? privatePage : null
    );
    statusCache.fetchStatusPage.mockReturnValue(payload);
  });

  it('should serve a public page without any credentials', async () => {
    const response = await requestPage({ statusPageId: 'public' });

    expect(response.statusCode).toEqual(200);
    expect(response._getJSONData().monitors).toEqual(payload.monitors);
  });

  it('should refuse a private page when there are no credentials', async () => {
    const response = await requestPage({});

    expect(response.statusCode).toEqual(401);
    expect(statusCache.fetchStatusPage).not.toHaveBeenCalled();
  });

  it('should serve a private page to a verified user with a live session', async () => {
    userSessionExists.mockResolvedValue({
      email: 'user@example.com',
      createdAt: new Date(Date.now() - 2 * dayMs).toISOString(),
    });
    getUserByEmail.mockResolvedValue({
      email: 'user@example.com',
      isVerified: 1,
    });

    const response = await requestPage({ cookies: { session_token: 'live' } });

    expect(response.statusCode).toEqual(200);
    expect(response._getJSONData().monitors).toEqual(payload.monitors);
  });

  it('should refuse a private page to a user who is not verified yet', async () => {
    // Anyone can register. The new account stays unverified until an admin
    // approves it or an invite is used. Such an account still gets a session
    // cookie. The routes behind the authorization middleware refuse it with a 403.
    userSessionExists.mockResolvedValue({
      email: 'new@example.com',
      createdAt: new Date().toISOString(),
    });
    getUserByEmail.mockResolvedValue({
      email: 'new@example.com',
      isVerified: 0,
    });

    const response = await requestPage({ cookies: { session_token: 'new' } });

    expect(response.statusCode).toEqual(401);
    expect(statusCache.fetchStatusPage).not.toHaveBeenCalled();
  });

  it('should refuse a private page to a session older than 60 days', async () => {
    userSessionExists.mockResolvedValue({
      email: 'user@example.com',
      createdAt: new Date(Date.now() - 61 * dayMs).toISOString(),
    });
    getUserByEmail.mockResolvedValue({
      email: 'user@example.com',
      isVerified: 1,
    });

    const response = await requestPage({ cookies: { session_token: 'old' } });

    expect(response.statusCode).toEqual(401);
    expect(statusCache.fetchStatusPage).not.toHaveBeenCalled();
  });

  it('should refuse a private page for a session token that does not exist', async () => {
    userSessionExists.mockResolvedValue(undefined);

    const response = await requestPage({ cookies: { session_token: 'nope' } });

    expect(response.statusCode).toEqual(401);
  });

  it('should refuse a private page when the session user was deleted', async () => {
    userSessionExists.mockResolvedValue({
      email: 'gone@example.com',
      createdAt: new Date().toISOString(),
    });
    getUserByEmail.mockResolvedValue(undefined);

    const response = await requestPage({ cookies: { session_token: 'gone' } });

    expect(response.statusCode).toEqual(401);
  });

  it('should serve a private page for a valid API token', async () => {
    apiTokenExists.mockResolvedValue({ token: 'abc', permission: 1 });

    const response = await requestPage({ headers: { authorization: 'abc' } });

    expect(apiTokenExists).toHaveBeenCalledWith('abc');
    expect(response.statusCode).toEqual(200);
    expect(response._getJSONData().monitors).toEqual(payload.monitors);
  });

  it('should refuse a private page for an unknown API token', async () => {
    apiTokenExists.mockResolvedValue(undefined);

    const response = await requestPage({ headers: { authorization: 'bad' } });

    expect(response.statusCode).toEqual(401);
    expect(statusCache.fetchStatusPage).not.toHaveBeenCalled();
  });
});
