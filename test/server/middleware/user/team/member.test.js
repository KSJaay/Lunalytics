import { createRequest, createResponse } from 'node-mocks-http';
import { fetchMembers } from '../../../../../server/database/queries/user';
import teamMembersListMiddleware from '../../../../../server/middleware/user/team/members';

vi.mock('../../../../../server/database/queries/user');

describe('permissionUpdateMiddleware - Middleware', () => {
  const user = {
    email: 'KSJaay@lunalytics.xyz',
    displayName: 'KSJaay',
    isVerified: false,
  };

  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fetchMembers = vi.fn().mockReturnValue([user, user]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 500 when fetchMembers throws an error', async () => {
    fetchMembers = vi.fn().mockImplementation(() => {
      throw new Error();
    });

    await teamMembersListMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(500);
  });

  it('should return 200 when fetchMembers returns an array of members', async () => {
    await teamMembersListMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.statusCode).toEqual(200);

    expect(fetchMembers).toHaveBeenCalled();
  });

  it('should return 200 when fetchMembers returns an array of members', async () => {
    fakeResponse.send = vi.fn();

    await teamMembersListMiddleware(fakeRequest, fakeResponse);

    expect(fetchMembers).toHaveBeenCalled();

    expect(fakeResponse.send).toHaveBeenCalledWith([user, user]);
  });
});
