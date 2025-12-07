import { renderHook, act } from '@testing-library/react';
import useIncidentMessage from '../useIncidentMessage';

// Mock axios post request
jest.mock('../../services/axios', () => ({
  createPostRequest: jest.fn(),
}));

// Mock incident message validator
jest.mock('../../../shared/validators/incident', () => ({
  incidentMessageValidator: jest.fn(),
}));

const { createPostRequest } = require('../../services/axios');
const { incidentMessageValidator } = require('../../../shared/validators/incident');

describe('useIncidentMessage Hook', () => {
  const defaultInputs = { monitorIds: [], status: 'Investigating', message: '' };
  const incidentId = '12345';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useIncidentMessage(undefined, incidentId));

    expect(result.current.values).toEqual(defaultInputs);
    expect(typeof result.current.dispatch).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
  });

  it('should update values when dispatch is called', () => {
    const { result } = renderHook(() => useIncidentMessage(undefined, incidentId));

    act(() => {
      result.current.dispatch({ key: 'status', value: 'Resolved' });
    });

    expect(result.current.values.status).toBe('Resolved');
  });

  it('should throw error if validation fails', async () => {
    incidentMessageValidator.mockImplementation(() => 'Validation failed');

    const { result } = renderHook(() => useIncidentMessage(undefined, incidentId));

    await expect(result.current.handleSubmit()).rejects.toThrow('Validation failed');

    expect(incidentMessageValidator).toHaveBeenCalledWith(result.current.values);
    expect(createPostRequest).not.toHaveBeenCalled();
  });

  it('should throw error if API response is not 200 or 201', async () => {
    incidentMessageValidator.mockImplementation(() => null);
    createPostRequest.mockResolvedValue({ status: 400, data: { message: 'Bad request' } });

    const { result } = renderHook(() => useIncidentMessage(undefined, incidentId));

    await expect(result.current.handleSubmit()).rejects.toThrow('Bad request');
    expect(createPostRequest).toHaveBeenCalledWith('/api/incident/messages/create', {
      ...result.current.values,
      incidentId,
      position: undefined,
    });
  });

  it('should return data if create submission is successful', async () => {
    const apiResponse = { id: 1, ...defaultInputs };
    incidentMessageValidator.mockImplementation(() => null);
    createPostRequest.mockResolvedValue({ status: 201, data: apiResponse });

    const { result } = renderHook(() => useIncidentMessage(undefined, incidentId));

    const data = await result.current.handleSubmit();

    expect(data).toEqual(apiResponse);
    expect(createPostRequest).toHaveBeenCalledWith('/api/incident/messages/create', {
      ...result.current.values,
      incidentId,
      position: undefined,
    });
  });

  it('should return data if update submission is successful', async () => {
    const apiResponse = { id: 1, ...defaultInputs };
    incidentMessageValidator.mockImplementation(() => null);
    createPostRequest.mockResolvedValue({ status: 200, data: apiResponse });

    const { result } = renderHook(() => useIncidentMessage(undefined, incidentId));

    const data = await result.current.handleSubmit(2); // passing position to trigger update

    expect(data).toEqual(apiResponse);
    expect(createPostRequest).toHaveBeenCalledWith('/api/incident/messages/update', {
      ...result.current.values,
      incidentId,
      position: 2,
    });
  });
});
