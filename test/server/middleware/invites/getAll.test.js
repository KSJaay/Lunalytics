import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import { fetchAllInvites } from '../../../../server/database/queries/invite.js';
import getAllInvitesMiddleware from '../../../../server/middleware/invites/getAll.js';

vi.mock('../../../../server/database/queries/invite.js');
vi.mock('../../../../server/utils/errors.js');

describe('getAllInvitesMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeResponse.status = vi.fn().mockReturnThis();
    fakeResponse.send = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return invites on success', async () => {
    fetchAllInvites.mockResolvedValue([{ id: 1 }]);

    await getAllInvitesMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(200);
    expect(fakeResponse.send).toHaveBeenCalledWith({ invites: [{ id: 1 }] });
  });

  it('should handle errors gracefully', async () => {
    fetchAllInvites.mockImplementation(() => {
      throw new Error('fail');
    });

    await getAllInvitesMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalled();
  });
});
