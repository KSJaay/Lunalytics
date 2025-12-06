// test/whitebox/hooks tests/useFetch.test.tsx
import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/react';

// Mock axios service before importing the hook
jest.mock('../../../app/services/axios', () => ({
  createGetRequest: jest.fn(),
}));

import useFetch from '../../../app/hooks/useFetch';
import { createGetRequest } from '../../../app/services/axios';

describe('useFetch hook', () => {
  const mockData = { message: 'success' };
  const mockError = new Error('Failed');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should not fetch if url is empty', () => {
    const { result } = renderHook(() => useFetch({ url: '' }));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  test('should fetch data successfully', async () => {
    (createGetRequest as jest.Mock).mockResolvedValue({ data: mockData });

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useFetch({ url: '/test', onSuccess }));

    // Wait for state updates
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
    expect(onSuccess).toHaveBeenCalledWith(mockData);
  });

  test('should handle fetch failure', async () => {
    (createGetRequest as jest.Mock).mockRejectedValue(mockError);

    const onFailure = jest.fn();
    const { result } = renderHook(() => useFetch({ url: '/fail', onFailure }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(mockError);
    expect(result.current.isError).toBe(true);
    expect(onFailure).toHaveBeenCalledWith(mockError);
  });

  test('should refetch when url changes', async () => {
    (createGetRequest as jest.Mock).mockResolvedValue({ data: mockData });

    const { result, rerender } = renderHook(
      ({ url }) => useFetch({ url }),
      { initialProps: { url: '/initial' } }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(createGetRequest).toHaveBeenCalledWith('/initial', undefined, undefined);

    rerender({ url: '/new-url' });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(createGetRequest).toHaveBeenCalledWith('/new-url', undefined, undefined);
  });

  test('should refetch when params or headers change', async () => {
    (createGetRequest as jest.Mock).mockResolvedValue({ data: mockData });

    const { result, rerender } = renderHook(
      ({ params, headers }) => useFetch({ url: '/test', params, headers }),
      { initialProps: { params: { a: 1 }, headers: { Authorization: 'token' } } }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    rerender({ params: { a: 2 }, headers: { Authorization: 'token' } });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(createGetRequest).toHaveBeenCalledWith('/test', { a: 2 }, { Authorization: 'token' });

    rerender({ params: { a: 2 }, headers: { Authorization: 'new-token' } });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(createGetRequest).toHaveBeenCalledWith('/test', { a: 2 }, { Authorization: 'new-token' });
  });

  test('should work without onSuccess and onFailure callbacks', async () => {
    (createGetRequest as jest.Mock).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useFetch({ url: '/test' }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });
});
