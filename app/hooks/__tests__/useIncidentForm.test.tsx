import { renderHook, act } from '@testing-library/react';
import useIncidentForm from '../useIncidentForm';

// Mock axios post request
jest.mock('../../services/axios', () => ({
  createPostRequest: jest.fn(),
}));

// Mock IncidentValidator
jest.mock('../../../shared/validators/incident', () => jest.fn());

const { createPostRequest } = require('../../services/axios');
const IncidentValidator = require('../../../shared/validators/incident');

describe('useIncidentForm Hook', () => {
  const defaultInputs = {
    monitorIds: [],
    messages: [],
    affect: 'Outage',
    status: 'Investigating',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useIncidentForm());

    expect(result.current.values).toEqual(defaultInputs);
    expect(typeof result.current.dispatch).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
  });

  it('should update values when dispatch is called', () => {
    const { result } = renderHook(() => useIncidentForm());

    act(() => {
      result.current.dispatch({ key: 'status', value: 'Resolved' });
    });

    expect(result.current.values.status).toBe('Resolved');
  });

  it('should throw error if validation fails', async () => {
    IncidentValidator.mockImplementation(() => 'Validation failed');

    const { result } = renderHook(() => useIncidentForm());

    await expect(result.current.handleSubmit()).rejects.toThrow('Validation failed');

    expect(IncidentValidator).toHaveBeenCalledWith(result.current.values);
    expect(createPostRequest).not.toHaveBeenCalled();
  });

  it('should throw error if API response is not 200 or 201', async () => {
    IncidentValidator.mockImplementation(() => null);
    createPostRequest.mockResolvedValue({ status: 400, data: { message: 'Bad request' } });

    const { result } = renderHook(() => useIncidentForm());

    await expect(result.current.handleSubmit()).rejects.toThrow('Bad request');
    expect(createPostRequest).toHaveBeenCalledWith('/api/incident/create', result.current.values);
  });

  it('should return data if submission is successful', async () => {
    const apiResponse = { id: 1, ...defaultInputs };
    IncidentValidator.mockImplementation(() => null);
    createPostRequest.mockResolvedValue({ status: 201, data: apiResponse });

    const { result } = renderHook(() => useIncidentForm());

    const data = await result.current.handleSubmit();

    expect(data).toEqual(apiResponse);
    expect(createPostRequest).toHaveBeenCalledWith('/api/incident/create', result.current.values);
  });
});
