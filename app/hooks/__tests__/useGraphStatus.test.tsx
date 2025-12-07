import { renderHook, act, waitFor } from '@testing-library/react';
import useGraphStatus from '../useGraphStatus';

// Mock axios service
jest.mock('../../services/axios', () => ({
  createGetRequest: jest.fn(),
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const { createGetRequest } = require('../../services/axios');
const { toast } = require('react-toastify');

describe('useGraphStatus Hook', () => {
  const monitor = {
    monitorId: 'monitor-123',
    heartbeats: [{ timestamp: 1, status: 'up' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default statusType and heartbeats', () => {
    const { result } = renderHook(() => useGraphStatus(monitor));

    expect(result.current.statusType).toBe('latest');
    expect(result.current.statusHeartbeats).toEqual(monitor.heartbeats);
  });

  it('should fetch monitor heartbeats successfully', async () => {
    const apiData = [{ timestamp: 2, status: 'down' }];
    createGetRequest.mockResolvedValueOnce({ status: 200, data: apiData });

    const { result } = renderHook(() => useGraphStatus(monitor));

    await waitFor(() => {
      expect(result.current.statusHeartbeats).toEqual(apiData);
    });

    expect(createGetRequest).toHaveBeenCalledWith('/api/monitor/status', {
      monitorId: monitor.monitorId,
      type: 'latest',
    });
  });

  it('should call toast.error on fetch failure', async () => {
    const error = new Error('Network error');
    createGetRequest.mockRejectedValueOnce(error);

    renderHook(() => useGraphStatus(monitor));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to fetch monitor heartbeats'
      );
    });
  });

  it('should allow setting statusType', () => {
    const { result } = renderHook(() => useGraphStatus(monitor));

    act(() => {
      result.current.setStatusType('weekly');
    });

    expect(result.current.statusType).toBe('weekly');
  });

  it('should allow setting statusHeartbeats manually', () => {
    const { result } = renderHook(() => useGraphStatus(monitor));

    const newHeartbeats = [{ timestamp: 3, status: 'up' }];
    act(() => {
      result.current.setStatusHeartbeats(newHeartbeats);
    });

    expect(result.current.statusHeartbeats).toEqual(newHeartbeats);
  });
});
