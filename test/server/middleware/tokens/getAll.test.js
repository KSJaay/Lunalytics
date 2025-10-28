import { createRequest, createResponse } from 'node-mocks-http';
import { handleError } from '../../../../server/utils/errors.js';
import { getAllApiTokens } from '../../../../server/database/queries/tokens.js';
import getAllApiTokensMiddleware from '../../../../server/middleware/tokens/getAll.js';

vi.mock('../../../../server/database/queries/tokens.js');
vi.mock('../../../../server/utils/errors.js');

describe('getAllApiTokensMiddleware', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    getAllApiTokens = vi.fn(() => Promise.resolve([{ id: 'id' }]));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all tokens and return them', async () => {
    await getAllApiTokensMiddleware(fakeRequest, fakeResponse);

    expect(getAllApiTokens).toHaveBeenCalled();
    expect(fakeResponse._getJSONData()).toEqual({ tokens: [{ id: 'id' }] });
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if getAllApiTokens throws', async () => {
    getAllApiTokens.mockImplementationOnce(() => {
      throw new Error('fail');
    });

    await getAllApiTokensMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalledWith(expect.any(Error), fakeResponse);
  });
});
