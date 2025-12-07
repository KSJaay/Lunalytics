/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Validator (Default Export)
jest.mock('../../../../shared/validators/incident.js', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock Database (Prevents potential ESM/nanoid crashes)
jest.mock('../../../../server/database/queries/incident.js', () => ({
  createIncident: jest.fn(),
}));

// Mock Cache
jest.mock('../../../../server/cache/status.js', () => ({
  __esModule: true,
  default: {
    addIncident: jest.fn(),
  },
}));

// Mock Error Handler
jest.mock('../../../../server/utils/errors.js', () => ({
  handleError: jest.fn(),
}));

// --- 2. IMPORT FILES ---
import createIncidentMiddleware from '../../../../server/middleware/incident/create.js';
import IncidentValidator from '../../../../shared/validators/incident.js';
import { createIncident } from '../../../../server/database/queries/incident.js';
import statusCache from '../../../../server/cache/status.js';
import { handleError } from '../../../../server/utils/errors.js';

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

    // Setup spies
    fakeResponse.status = jest.fn().mockReturnThis();
    fakeResponse.json = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if incident is invalid', async () => {
    // Validator returns error string
    IncidentValidator.mockReturnValue('invalid');

    await createIncidentMiddleware(fakeRequest, fakeResponse);

    expect(fakeResponse.status).toHaveBeenCalledWith(400);
    expect(fakeResponse.json).toHaveBeenCalledWith({ message: 'invalid' });
  });

  it('should create incident and return data if valid', async () => {
    // Validator returns false (meaning no errors)
    IncidentValidator.mockReturnValue(false);
    
    // DB returns success
    createIncident.mockResolvedValue({ created: true });

    await createIncidentMiddleware(fakeRequest, fakeResponse);

    expect(createIncident).toHaveBeenCalled();
    expect(statusCache.addIncident).toHaveBeenCalled();
    expect(fakeResponse.json).toHaveBeenCalledWith({ created: true });
  });

  it('should handle errors gracefully', async () => {
    // Force Validator to throw
    IncidentValidator.mockImplementation(() => {
      throw new Error('fail');
    });

    await createIncidentMiddleware(fakeRequest, fakeResponse);

    expect(handleError).toHaveBeenCalled();
  });
});
