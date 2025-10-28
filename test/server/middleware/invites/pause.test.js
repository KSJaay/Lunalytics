import { createRequest, createResponse } from 'node-mocks-http';
import {
  fetchInviteUsingId,
  pauseInvite,
} from '../../../../server/database/queries/invite.js';
import { handleError } from '../../../../server/utils/errors.js';
import pauseInviteMiddleware from '../../../../server/middleware/invites/pause.js';

vi.mock('../../../../server/database/queries/invite.js');
vi.mock('../../../../server/utils/errors.js');

describe('pauseInviteMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = { id: 'id', paused: true };
    fakeResponse.status = vi.fn().mockReturnThis();
    fakeResponse.send = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if id is missing', async () => {
    fakeRequest.body.id = undefined;

    await pauseInviteMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith({
      message: 'No invite id provided',
    });
  });

  it('should return 404 if invite not found', async () => {
    fetchInviteUsingId.mockResolvedValue(null);

    await pauseInviteMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(404);
    expect(fakeResponse.send).toHaveBeenCalledWith({
      message: 'Invite not found',
    });
  });

  it('should pause invite and return success', async () => {
    fetchInviteUsingId.mockResolvedValue({ id: 'id' });

    await pauseInviteMiddleware(fakeRequest, fakeResponse);
    expect(pauseInvite).toHaveBeenCalledWith('id', true);

    expect(fakeResponse.status).toHaveBeenCalledWith(200);
    expect(fakeResponse.send).toHaveBeenCalledWith({
      message: 'Invite has been paused successfully',
    });
  });

  it('should handle errors gracefully', async () => {
    fetchInviteUsingId.mockImplementation(() => {
      throw new Error('fail');
    });

    await pauseInviteMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalled();
  });
});
