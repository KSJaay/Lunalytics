import { renderHook, act } from '@testing-library/react';
import useIncidentForm from '../../../app/hooks/useIncidentForm';
import { createPostRequest } from '../../../app/services/axios';
import IncidentValidator from '../../../shared/validators/incident';

// Mock axios post request
jest.mock('../../../app/services/axios', () => ({
  createPostRequest: jest.fn(),
}));

// Mock validator
jest.mock('../../../shared/validators/incident', () => jest.fn());

describe('useIncidentForm hook', () => {
  const defaultInputs = {
    monitorIds: [],
    messages: [],
    affect: 'Outage',
    status: 'Investigating',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useIncidentForm());
    expect(result.current.values).toEqual(defaultInputs);
  });

  test('should initialize with user-provided values', () => {
    const customValues = { ...defaultInputs, status: 'Resolved' };
    const { result } = renderHook(() => useIncidentForm(customValues));
    expect(result.current.values).toEqual(customValues);
  });

  test('should update a value using dispatch', () => {
    const { result } = renderHook(() => useIncidentForm());
    act(() => {
      result.current.dispatch({ key: 'status', value: 'Resolved' });
    });
    expect(result.current.values.status).toBe('Resolved');
  });

  test('should throw error if validator fails', async () => {
    (IncidentValidator as jest.Mock).mockReturnValue('Validation failed');
    const { result } = renderHook(() => useIncidentForm());

    await expect(result.current.handleSubmit()).rejects.toThrow('Validation failed');
    expect(IncidentValidator).toHaveBeenCalledWith(defaultInputs);
  });

  test('should call createPostRequest if validation passes', async () => {
    (IncidentValidator as jest.Mock).mockReturnValue(null);
    (createPostRequest as jest.Mock).mockResolvedValue({ status: 201, data: { id: '123' } });

    const { result } = renderHook(() => useIncidentForm());
    const data = await result.current.handleSubmit();

    expect(createPostRequest).toHaveBeenCalledWith('/api/incident/create', defaultInputs);
    expect(data).toEqual({ id: '123' });
  });

  test('should throw error if createPostRequest returns invalid status', async () => {
    (IncidentValidator as jest.Mock).mockReturnValue(null);
    (createPostRequest as jest.Mock).mockResolvedValue({ status: 400, data: { message: 'Failed' } });

    const { result } = renderHook(() => useIncidentForm());

    await expect(result.current.handleSubmit()).rejects.toThrow('Failed');
  });

  test('should allow updating multiple fields', () => {
    const { result } = renderHook(() => useIncidentForm());

    act(() => {
      result.current.dispatch({ key: 'status', value: 'Resolved' });
      result.current.dispatch({ key: 'affect', value: 'Performance' });
    });

    expect(result.current.values.status).toBe('Resolved');
    expect(result.current.values.affect).toBe('Performance');
  });

  test('should handle submission without monitorIds', async () => {
    (IncidentValidator as jest.Mock).mockReturnValue(null);
    (createPostRequest as jest.Mock).mockResolvedValue({ status: 201, data: { id: '1' } });

    const { result } = renderHook(() => useIncidentForm({ ...defaultInputs, monitorIds: [] }));
    const data = await result.current.handleSubmit();

    expect(data).toEqual({ id: '1' });
    expect(createPostRequest).toHaveBeenCalledWith('/api/incident/create', { ...defaultInputs, monitorIds: [] });
  });

  test('should handle submission with multiple messages', async () => {
    (IncidentValidator as jest.Mock).mockReturnValue(null);
    (createPostRequest as jest.Mock).mockResolvedValue({ status: 201, data: { id: '2' } });

    const { result } = renderHook(() => useIncidentForm({ ...defaultInputs, messages: ['msg1', 'msg2'] }));
    const data = await result.current.handleSubmit();

    expect(data).toEqual({ id: '2' });
    expect(result.current.values.messages).toEqual(['msg1', 'msg2']);
  });

  test('should allow affect field to be changed', () => {
    const { result } = renderHook(() => useIncidentForm());
    act(() => {
      result.current.dispatch({ key: 'affect', value: 'Performance' });
    });
    expect(result.current.values.affect).toBe('Performance');
  });

  test('should allow status field to be changed', () => {
    const { result } = renderHook(() => useIncidentForm());
    act(() => {
      result.current.dispatch({ key: 'status', value: 'Resolved' });
    });
    expect(result.current.values.status).toBe('Resolved');
  });
});
