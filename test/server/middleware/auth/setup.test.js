import { ownerExists } from '../../../../server/database/queries/user.js';
import setupMiddleware from '../../../../server/middleware/auth/setup.js';
import config from '../../../../server/utils/config.js';

vi.mock('../../../../server/utils/config.js');
vi.mock('../../../../server/database/queries/user.js');

describe('setupMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = {
      body: {
        type: 'basic',
        email: 'test@example.com',
        username: 'user',
        password: 'pass',
        databaseType: 'sqlite',
        databaseName: 'db',
        websiteUrl: 'http://localhost',
        migrationType: 'none',
      },
      headers: { 'user-agent': 'test-agent' },
      protocol: 'http',
    };

    fakeResponse = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      sendStatus: vi.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 400 for invalid setup type', async () => {
    fakeRequest.body.type = 'invalid';

    await setupMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith({
      general: 'Invalid setup type',
    });
  });

  it('should return 400 if database and owner exists', async () => {
    config.get.mockReturnValue({ name: 'db' });
    ownerExists.mockImplementation(() => Promise.resolve(true));

    await setupMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.send).toHaveBeenCalledWith(
      expect.objectContaining({ errorType: 'ownerExists' })
    );
  });
});
