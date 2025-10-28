import { createRequest, createResponse } from 'node-mocks-http';
import statusCache from '../../../../server/cache/status.js';
import { handleError } from '../../../../server/utils/errors.js';
import IncidentValidator from '../../../../shared/validators/incident.js';
import { createIncident } from '../../../../server/database/queries/incident.js';
import createIncidentMiddleware from '../../../../server/middleware/incident/create.js';

vi.mock('../../../../shared/validators/incident.js');
vi.mock('../../../../server/database/queries/incident.js');
vi.mock('../../../../server/cache/status.js');
vi.mock('../../../../server/utils/errors.js');

describe('createIncidentMiddleware', () => {
  let fakeRequest, fakeResponse;
  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.body = {
      title: 't',
      monitorIds: ['m'],
      affect: 'a',
      status: 's',
      message: 'msg',
    };

    fakeRequest.locals = { user: { email: 'e' } };

    fakeResponse.locals = { user: { email: 'e' } };

    fakeResponse.status = vi.fn().mockReturnThis();
    fakeResponse.json = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if incident is invalid', async () => {
    IncidentValidator.mockReturnValue('invalid');

    await createIncidentMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({ message: 'invalid' });
  });

  it('should create incident and return data if valid', async () => {
    IncidentValidator.mockReturnValue(false);
    createIncident.mockResolvedValue({ created: true });

    await createIncidentMiddleware(fakeRequest, fakeResponse);

    expect(createIncident).toHaveBeenCalled();
    expect(statusCache.addIncident).toHaveBeenCalled();
    expect(fakeResponse.json).toHaveBeenCalledWith({ created: true });
  });

  it('should handle errors gracefully', async () => {
    IncidentValidator.mockImplementation(() => {
      throw new Error('fail');
    });

    await createIncidentMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalled();
  });
});
