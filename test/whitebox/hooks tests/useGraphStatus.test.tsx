import { renderHook, act, waitFor } from '@testing-library/react';
import useGraphStatus from '../../../app/hooks/useGraphStatus';
import { toast } from 'react-toastify';
import { createGetRequest } from '../../../app/services/axios';

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mock axios service
jest.mock('../../../app/services/axios', () => ({
  createGetRequest: jest.fn(),
}));

describe('useGraphStatus hook', () => {
  const mockMonitor = {
    monitorId: '123',
    heartbeats: [{ id: 'hb1', status: 'ok' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default state', () => {
    const { result } = renderHook(() => useGraphStatus(mockMonitor));

    expect(result.current.statusType).toBe('latest');
    expect(result.current.statusHeartbeats).toEqual(mockMonitor.heartbeats);
  });

  test('should fetch heartbeats successfully and update state', async () => {
    const mockData = [{ id: 'hb2', status: 'fail' }];
    (createGetRequest as jest.Mock).mockResolvedValue({ status: 200, data: mockData });

    const { result } = renderHook(() => useGraphStatus(mockMonitor));

    // Wait for async effect to complete
    await waitFor(() => expect(result.current.statusHeartbeats).toEqual(mockData));

    expect(createGetRequest).toHaveBeenCalledWith('/api/monitor/status', {
      monitorId: mockMonitor.monitorId,
      type: 'latest',
    });
  });

  test('should handle fetch failure and call toast.error', async () => {
    const error = new Error('Network error');
    (createGetRequest as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useGraphStatus(mockMonitor));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch monitor heartbeats')
    );
  });

  test('should update statusType using setStatusType', () => {
    const { result } = renderHook(() => useGraphStatus(mockMonitor));

    act(() => {
      result.current.setStatusType('weekly');
    });

    expect(result.current.statusType).toBe('weekly');
  });

  test('should update statusHeartbeats using setStatusHeartbeats', () => {
    const { result } = renderHook(() => useGraphStatus(mockMonitor));
    const newHeartbeats = [{ id: 'hb3', status: 'ok' }];

    act(() => {
      result.current.setStatusHeartbeats(newHeartbeats);
    });

    expect(result.current.statusHeartbeats).toEqual(newHeartbeats);
  });
});
