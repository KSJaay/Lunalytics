import { createRequest, createResponse } from 'node-mocks-http';
import logger from '../../../../server/utils/logger.js';
import getAllIncidents from '../../../../server/middleware/incident/getAll.js';
import { fetchAllIncidents } from '../../../../server/database/queries/incident.js';

vi.mock('../../../../server/database/queries/incident.js');
vi.mock('../../../../server/utils/logger.js');

describe('getAllIncidents', () => {
  let fakeRequest, fakeResponse;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeResponse.json = vi.fn();
    fakeResponse.status = vi.fn().mockReturnThis();
    fakeResponse.send = vi.fn().mockReturnThis();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return incidents on success', async () => {
    fetchAllIncidents.mockResolvedValue([{ id: 1 }]);

    await getAllIncidents(fakeRequest, fakeResponse);

    expect(fakeResponse.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('should handle errors and log', async () => {
    fetchAllIncidents.mockImplementation(() => {
      throw new Error('fail');
    });

    await getAllIncidents(fakeRequest, fakeResponse);

    expect(logger.error).toHaveBeenCalled();
    expect(fakeResponse.status).toHaveBeenCalledWith(500);
    expect(fakeResponse.send).toHaveBeenCalledWith({
      message: 'Something went wrong',
    });
  });
});
