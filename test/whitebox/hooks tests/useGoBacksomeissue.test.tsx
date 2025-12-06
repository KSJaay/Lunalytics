// test/whitebox/hooks tests/useGoBack.test.tsx
import { renderHook } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import useGoBack from '../../../app/hooks/useGoBack';
import { act } from 'react-dom/test-utils';

describe('useGoBack hook', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const wrapper = ({ initialEntries = ['/'] as string[], children }: any) => (
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="*" element={children} />
      </Routes>
    </MemoryRouter>
  );

  test('should navigate back when previous key is not "default"', () => {
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      pathname: '/current',
      search: '',
      hash: '',
      state: null,
      key: '123', // simulate non-default key
    });

    const { result } = renderHook(() => useGoBack(), { wrapper });

    act(() => {
      result.current(); // call goBack
    });

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('should navigate to fallback when previous key is "default"', () => {
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      pathname: '/current',
      search: '',
      hash: '',
      state: null,
      key: 'default', // simulate default key
    });

    const { result } = renderHook(() => useGoBack(), { wrapper });

    act(() => {
      result.current(); // call goBack with default fallback
    });

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  test('should navigate to custom fallback when previous key is "default"', () => {
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      pathname: '/current',
      search: '',
      hash: '',
      state: null,
      key: 'default', // default key
    });

    const { result } = renderHook(() => useGoBack(), { wrapper });

    act(() => {
      result.current({ fallback: '/dashboard' });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
