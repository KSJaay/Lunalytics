import { renderHook } from '@testing-library/react';
import { useNavigate, useLocation } from 'react-router-dom';
import useGoBack from '../useGoBack';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe('useGoBack Hook', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('should navigate back if location key is not "default"', () => {
    (useLocation as jest.Mock).mockReturnValue({ key: '123' });

    const { result } = renderHook(() => useGoBack());
    result.current(); // call the returned function

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should navigate to fallback if location key is "default"', () => {
    (useLocation as jest.Mock).mockReturnValue({ key: 'default' });

    const { result } = renderHook(() => useGoBack());
    result.current(); // call the returned function

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('should navigate to custom fallback if provided', () => {
    (useLocation as jest.Mock).mockReturnValue({ key: 'default' });

    const { result } = renderHook(() => useGoBack());
    result.current({ fallback: '/dashboard' });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
