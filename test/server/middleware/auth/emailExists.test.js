import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import emailExistsMiddleware from '../../../../server/middleware/auth/emailExists.js';
import { getUserByEmail } from '../../../../server/database/queries/user.js';

vi.mock('../../../../server/database/queries/user.js');

describe('emailExistsMiddleware', () => {
  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    fakeRequest = { body: { email: 'test@example.com' } };
    fakeResponse = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      sendStatus: vi.fn().mockReturnThis(),
    };
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 400 if no email provided', async () => {
    fakeRequest.body.email = undefined;
    await emailExistsMiddleware(fakeRequest, fakeResponse);
    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith('No email provided');
  });

  it('should return 404 if user not found', async () => {
    getUserByEmail.mockResolvedValue(null);
    await emailExistsMiddleware(fakeRequest, fakeResponse);
    expect(fakeResponse.sendStatus).toHaveBeenCalledWith(404);
  });

  it('should return 200 if user found', async () => {
    getUserByEmail.mockResolvedValue({ id: 1 });
    await emailExistsMiddleware(fakeRequest, fakeResponse);
    expect(fakeResponse.sendStatus).toHaveBeenCalledWith(200);
  });
});
