import { renderHook, act } from '@testing-library/react';
import useIncidentMessage from '../../../app/hooks/useIncidentMessage';
import { createPostRequest } from '../../../app/services/axios';
import { incidentMessageValidator } from '../../../shared/validators/incident';

// Mock axios post request
jest.mock('../../../app/services/axios', () => ({
  createPostRequest: jest.fn(),
}));

// Mock validator
jest.mock('../../../shared/validators/incident', () => ({
  incidentMessageValidator: jest.fn(),
}));

describe('useIncidentMessage hook', () => {
  const defaultInputs = { monitorIds: [], status: 'Investigating', message: '' };
  const incidentId = 'incident-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------------
  // Initialization Tests
  // ------------------------
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useIncidentMessage(undefined, incidentId));
    expect(result.current.values).toEqual(defaultInputs);
  });

  test('should initialize with custom user-provided values', () => {
    const customValues = { monitorIds: ['m1'], status: 'Resolved', message: 'Test message' };
    const { result } = renderHook(() => useIncidentMessage(customValues, incidentId));
    expect(result.current.values).toEqual(customValues);
  });

  // ------------------------
  // Reducer / State Updates
  // ------------------------
  test('should update a single field using dispatch', () => {
    const { result } = renderHook(() => useIncidentMessage(undefined, incidentId));
    act(() => {
      result.current.dispatch({ key: 'status', value: 'Resolved' });
    });
    expect(result.current.values.status).toBe('Resolved');
  });

  test('should update multiple fields consecutively', () => {
    const { result } = renderHook(() => useIncidentMessage(undefined, incidentId));
    act(() => {
      result.current.dispatch({ key: 'status', value: 'Resolved' });
      result.current.dispatch({ key: 'message', value: 'Issue fixed' });
    });
    expect(result.current.values.status).toBe('Resolved');
    expect(result.current.values.message).toBe('Issue fixed');
  });

  test('should update monitorIds array', () => {
    const { result } = renderHook(() => useIncidentMessage(undefined, incidentId));
    act(() => {
      result.current.dispatch({ key: 'monitorIds', value: ['m1', 'm2'] });
    });
    expect(result.current.values.monitorIds).toEqual(['m1', 'm2']);
  });

  // ------------------------
  // Validation Tests
  // ------------------------
  test('should throw error if validator fails', async () => {
    (incidentMessageValidator as jest.Mock).mockReturnValue('Validation failed');
    const { result } = renderHook(() => useIncidentMessage(undefined, incidentId));
    await expect(result.current.handleSubmit()).rejects.toThrow('Validation failed');
    expect(incidentMessageValidator).toHaveBeenCalledWith(defaultInputs);
  });

  test('should call createPostRequest if validation passes', async () => {
    (incidentMessageValidator as jest.Mock).mockReturnValue(null);
    (createPostRequest as jest.Mock).mockResolvedValue({ status: 201, data: { id: 'msg-1' } });

    const { result } = renderHook(() => useIncidentMessage(undefined, incidentId));
    const data = await result.current.handleSubmit();

    expect(createPostRequest).toHaveBeenCalledWith('/api/incident/messages/create', {
      ...defaultInputs,
      incidentId,
      position: undefined,
    });
    expect(data).toEqual({ id: 'msg-1' });
  });

  test('should call update API if position is provided', async () => {
    (incidentMessageValidator as jest.Mock).mockReturnValue(null);
    (createPostRequest as jest.Mock).mockResolvedValue({ status: 200, data: { id: 'msg-2' } });

    const { result } = renderHook(() => useIncidentMessage(undefined, incidentId));
    const data = await result.current.handleSubmit(5);

    expect(createPostRequest).toHaveBeenCalledWith('/api/incident/messages/update', {
      ...defaultInputs,
      incidentId,
      position: 5,
    });
    expect(data).toEqual({ id: 'msg-2' });
  });

  test('should throw error if createPostRequest returns invalid status', async () => {
    (incidentMessageValidator as jest.Mock).mockReturnValue(null);
    (createPostRequest as jest.Mock).mockResolvedValue({
      status: 400,
      data: { message: 'Failed to save' },
    });

    const { result } = renderHook(() => useIncidentMessage(undefined, incidentId));
    await expect(result.current.handleSubmit()).rejects.toThrow('Failed to save');
  });

  test('should handle empty message field', async () => {
    (incidentMessageValidator as jest.Mock).mockReturnValue(null);
    (createPostRequest as jest.Mock).mockResolvedValue({ status: 201, data: { id: 'msg-3' } });

    const { result } = renderHook(() => useIncidentMessage({ ...defaultInputs, message: '' }, incidentId));
    const data = await result.current.handleSubmit();
    expect(data).toEqual({ id: 'msg-3' });
  });

  test('should handle non-empty message field', async () => {
    (incidentMessageValidator as jest.Mock).mockReturnValue(null);
    (createPostRequest as jest.Mock).mockResolvedValue({ status: 201, data: { id: 'msg-4' } });

    const { result } = renderHook(() =>
      useIncidentMessage({ ...defaultInputs, message: 'Test message' }, incidentId)
    );
    const data = await result.current.handleSubmit();
    expect(data).toEqual({ id: 'msg-4' });
  });

  test('should handle monitorIds with multiple entries', async () => {
    (incidentMessageValidator as jest.Mock).mockReturnValue(null);
    (createPostRequest as jest.Mock).mockResolvedValue({ status: 201, data: { id: 'msg-5' } });

    const { result } = renderHook(() =>
      useIncidentMessage({ ...defaultInputs, monitorIds: ['m1', 'm2'] }, incidentId)
    );
    const data = await result.current.handleSubmit();
    expect(data).toEqual({ id: 'msg-5' });
    expect(result.current.values.monitorIds).toEqual(['m1', 'm2']);
  });

  test('should throw error for network failure', async () => {
    (incidentMessageValidator as jest.Mock).mockReturnValue(null);
    (createPostRequest as jest.Mock).mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useIncidentMessage(undefined, incidentId));
    await expect(result.current.handleSubmit()).rejects.toThrow('Network Error');
  });

  test('should allow rapid consecutive dispatches', () => {
    const { result } = renderHook(() => useIncidentMessage(undefined, incidentId));
    act(() => {
      result.current.dispatch({ key: 'status', value: 'Resolved' });
      result.current.dispatch({ key: 'message', value: 'Updated message' });
      result.current.dispatch({ key: 'monitorIds', value: ['m3'] });
    });

    expect(result.current.values.status).toBe('Resolved');
    expect(result.current.values.message).toBe('Updated message');
    expect(result.current.values.monitorIds).toEqual(['m3']);
  });

  test('should handle edge case: undefined incidentId', async () => {
    (incidentMessageValidator as jest.Mock).mockReturnValue(null);
    (createPostRequest as jest.Mock).mockResolvedValue({ status: 201, data: { id: 'msg-6' } });

    const { result } = renderHook(() => useIncidentMessage(undefined, undefined as any));
    const data = await result.current.handleSubmit();
    expect(createPostRequest).toHaveBeenCalledWith('/api/incident/messages/create', {
      ...defaultInputs,
      incidentId: undefined,
      position: undefined,
    });
    expect(data).toEqual({ id: 'msg-6' });
  });

  test('should handle edge case: empty monitorIds and message', async () => {
    (incidentMessageValidator as jest.Mock).mockReturnValue(null);
    (createPostRequest as jest.Mock).mockResolvedValue({ status: 201, data: { id: 'msg-7' } });

    const { result } = renderHook(() =>
      useIncidentMessage({ monitorIds: [], status: 'Investigating', message: '' }, incidentId)
    );
    const data = await result.current.handleSubmit();
    expect(data).toEqual({ id: 'msg-7' });
  });
});
