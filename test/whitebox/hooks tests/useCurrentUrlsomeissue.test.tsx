import { renderHook } from '@testing-library/react';
import useCurrentUrl from '../../../app/hooks/useCurrentUrl';

describe('useCurrentUrl', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock window.location as writable
    delete (window as any).location;
    (window as any).location = {
      protocol: 'http:',
      hostname: 'localhost',
      port: '',
      pathname: '/initial-path',
    };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  test('should return initial pathname first', () => {
    const { result } = renderHook(() => useCurrentUrl());
    // Initial state is the pathname
    expect(result.current).toBe('/initial-path');
  });

  test('should return full URL after useLayoutEffect', () => {
    const { result } = renderHook(() => useCurrentUrl());
    // After the effect, state is updated to full URL
    expect(result.current).toBe('http://localhost');
  });

  test('should include port if present', () => {
    window.location.port = '3000';
    const { result } = renderHook(() => useCurrentUrl());
    expect(result.current).toBe('http://localhost:3000');
  });

  test('should handle empty port correctly', () => {
    window.location.port = '';
    const { result } = renderHook(() => useCurrentUrl());
    expect(result.current).toBe('http://localhost');
  });

  test('should update if window.location changes (simulate effect rerun)', () => {
    const { result, rerender } = renderHook(() => useCurrentUrl());
    // Update location
    window.location.protocol = 'https:';
    window.location.hostname = 'example.com';
    window.location.port = '8080';
    rerender();
    expect(result.current).toBe('https://example.com:8080');
  });
});
