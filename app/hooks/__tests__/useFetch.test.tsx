import { renderHook, waitFor } from '@testing-library/react';
import useFetch from '../useFetch';
import { createGetRequest } from '../../services/axios';

jest.mock('../../services/axios', () => ({
  createGetRequest: jest.fn(),
}));

const mockedCreateGetRequest = createGetRequest as jest.Mock;

describe('useFetch Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useFetch({ url: '' }));

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  it('should fetch data successfully', async () => {
    const mockData = { message: 'success' };
    mockedCreateGetRequest.mockResolvedValueOnce({ data: mockData });

    const onSuccess = jest.fn();

    const { result } = renderHook(() => useFetch({ url: '/test', onSuccess }));

    // Wait for the hook to update after promise resolves
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
    expect(onSuccess).toHaveBeenCalledWith(mockData);
  });

  it('should handle fetch failure', async () => {
    const mockError = new Error('Failed to fetch');
    mockedCreateGetRequest.mockRejectedValueOnce(mockError);

    const onFailure = jest.fn();

    const { result } = renderHook(() => useFetch({ url: '/test', onFailure }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(mockError);
    expect(result.current.isError).toBe(true);
    expect(onFailure).toHaveBeenCalledWith(mockError);
  });

  it('should not fetch if url is empty', () => {
    renderHook(() => useFetch({ url: '' }));
    expect(mockedCreateGetRequest).not.toHaveBeenCalled();
  });
});
