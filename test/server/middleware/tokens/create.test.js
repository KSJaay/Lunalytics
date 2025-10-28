import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import TokenValidator from '../../../../shared/validators/token.js';
import { apiTokenCreate } from '../../../../server/database/queries/tokens.js';
import createApiTokenMiddleware from '../../../../server/middleware/tokens/create.js';

vi.mock('../../../../shared/validators/token.js');
vi.mock('../../../../server/database/queries/tokens.js');
vi.mock('../../../../server/utils/errors.js', () => ({ handleError: vi.fn() }));

describe('createApiTokenMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeResponse.locals = { user: { email: 'test@example.com' } };

    apiTokenCreate = vi.fn(() => Promise.resolve({ id: 'id' }));
    TokenValidator = vi.fn(() => false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if validation fails', async () => {
    TokenValidator.mockReturnValueOnce('invalid');
    fakeRequest.body = { name: 'n', permission: 'p' };

    await createApiTokenMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse._getStatusCode()).toBe(400);
    expect(fakeResponse._getData()).toEqual(
      expect.objectContaining({ message: 'invalid' })
    );
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should create token and return 200', async () => {
    fakeRequest.body = { name: 'n', permission: 'p' };

    await createApiTokenMiddleware(fakeRequest, fakeResponse);

    expect(apiTokenCreate).toHaveBeenCalledWith('test@example.com', 'p', 'n');
    expect(fakeResponse._getStatusCode()).toBe(200);
    expect(fakeResponse._getData()).toEqual(
      expect.objectContaining({ id: 'id' })
    );
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if error thrown', async () => {
    apiTokenCreate.mockImplementationOnce(() => {
      throw new Error('fail');
    });
    fakeRequest.body = { name: 'n', permission: 'p' };

    await createApiTokenMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
