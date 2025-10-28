import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import TokenValidator from '../../../../shared/validators/token.js';
import { apiTokenUpdate } from '../../../../server/database/queries/tokens.js';
import updateApiTokenMiddleware from '../../../../server/middleware/tokens/update.js';

vi.mock('../../../../shared/validators/token.js');
vi.mock('../../../../server/database/queries/tokens.js');
vi.mock('../../../../server/utils/errors.js');

describe('updateApiTokenMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    apiTokenUpdate = vi.fn(() => Promise.resolve({ id: 'id' }));
    TokenValidator = vi.fn(() => false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if validation fails', async () => {
    TokenValidator.mockReturnValueOnce('invalid');
    fakeRequest.body = { token: 't', name: 'n', permission: 'p' };

    await updateApiTokenMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse._getStatusCode()).toBe(400);
    expect(fakeResponse._getData()).toEqual(
      expect.objectContaining({ message: 'invalid' })
    );
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should update token and return 200', async () => {
    fakeRequest.body = { token: 't', name: 'n', permission: 'p' };

    await updateApiTokenMiddleware(fakeRequest, fakeResponse);

    expect(apiTokenUpdate).toHaveBeenCalledWith('t', 'n', 'p');
    expect(fakeResponse._getStatusCode()).toBe(200);
    expect(fakeResponse._getData()).toEqual(
      expect.objectContaining({ id: 'id' })
    );
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if error thrown', async () => {
    apiTokenUpdate.mockImplementationOnce(() => {
      throw new Error('fail');
    });
    fakeRequest.body = { token: 't', name: 'n', permission: 'p' };

    await updateApiTokenMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
