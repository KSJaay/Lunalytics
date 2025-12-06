import { renderHook, act } from '@testing-library/react';
import { useLocalStorageState } from '../../../app/hooks/useLocalStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(Intl, 'DateTimeFormat', {
  value: jest.fn(() => ({ resolvedOptions: () => ({ timeZone: 'Europe/London' }) })),
});

describe('useLocalStorageState hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.documentElement.dataset.theme = '';
    document.documentElement.dataset.color = '';
    localStorage.clear();
  });

  // ------------------------
  // Initialization Tests
  // ------------------------
  test('should initialize with default values if localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorageState());
    expect(result.current.timezone).toBe('Europe/London');
    expect(result.current.dateformat).toBe('DD/MM/YYYY');
    expect(result.current.timeformat).toBe('HH:mm:ss');
    expect(result.current.theme).toBe('dark');
    expect(result.current.color).toBe('Green');
    expect(result.current.layout).toBe('compact');
    expect(result.current.status).toBe('all');
  });

  test('should read values from localStorage on mount', () => {
    localStorage.setItem('timezone', 'America/New_York');
    localStorage.setItem('theme', 'light');
    const { result } = renderHook(() => useLocalStorageState());
    expect(result.current.timezone).toBe('America/New_York');
    expect(result.current.theme).toBe('light');
  });

  test('should set document.dataset.theme and color on mount', () => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('color', 'Blue');
    renderHook(() => useLocalStorageState());
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.documentElement.dataset.color).toBe('Blue');
  });

  // ------------------------
  // Setter Functions
  // ------------------------
  test('setTimezone updates state and localStorage', () => {
    const { result } = renderHook(() => useLocalStorageState());
    act(() => result.current.setTimezone('Asia/Tokyo'));
    expect(result.current.timezone).toBe('Asia/Tokyo');
    expect(localStorage.setItem).toHaveBeenCalledWith('timezone', 'Asia/Tokyo');
  });

  test('setDateformat updates state and localStorage', () => {
    const { result } = renderHook(() => useLocalStorageState());
    act(() => result.current.setDateformat('MM-DD-YYYY'));
    expect(result.current.dateformat).toBe('MM-DD-YYYY');
    expect(localStorage.setItem).toHaveBeenCalledWith('dateformat', 'MM-DD-YYYY');
  });

  test('setTimeformat updates state and localStorage', () => {
    const { result } = renderHook(() => useLocalStorageState());
    act(() => result.current.setTimeformat('HH:mm'));
    expect(result.current.timeformat).toBe('HH:mm');
    expect(localStorage.setItem).toHaveBeenCalledWith('timeformat', 'HH:mm');
  });

  test('setTheme updates state, localStorage, and dataset', () => {
    const { result } = renderHook(() => useLocalStorageState());
    act(() => result.current.setTheme('light'));
    expect(result.current.theme).toBe('light');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  test('setColor updates state, localStorage, and dataset', () => {
    const { result } = renderHook(() => useLocalStorageState());
    act(() => result.current.setColor('Red'));
    expect(result.current.color).toBe('Red');
    expect(localStorage.setItem).toHaveBeenCalledWith('color', 'Red');
    expect(document.documentElement.dataset.color).toBe('Red');
  });

  test('setLayout updates state and localStorage', () => {
    const { result } = renderHook(() => useLocalStorageState());
    act(() => result.current.setLayout('list'));
    expect(result.current.layout).toBe('list');
    expect(localStorage.setItem).toHaveBeenCalledWith('layout', 'list');
  });

  test('setStatus updates state and localStorage', () => {
    const { result } = renderHook(() => useLocalStorageState());
    act(() => result.current.setStatus('active'));
    expect(result.current.status).toBe('active');
    expect(localStorage.setItem).toHaveBeenCalledWith('status', 'active');
  });

  // ------------------------
  // Edge Cases
  // ------------------------
  test('should fallback to defaults if localStorage returns null', () => {
    jest.spyOn(localStorage, 'getItem').mockReturnValueOnce(null);
    const { result } = renderHook(() => useLocalStorageState());
    expect(result.current.timezone).toBe('Europe/London');
  });

  test('should allow rapid consecutive updates', () => {
    const { result } = renderHook(() => useLocalStorageState());
    act(() => {
      result.current.setTimezone('UTC');
      result.current.setTheme('light');
      result.current.setColor('Yellow');
    });
    expect(result.current.timezone).toBe('UTC');
    expect(result.current.theme).toBe('light');
    expect(result.current.color).toBe('Yellow');
  });

  test('should preserve previous state when updating a single value', () => {
    const { result } = renderHook(() => useLocalStorageState());
    act(() => result.current.setStatus('pending'));
    expect(result.current.timezone).toBe('Europe/London');
    expect(result.current.status).toBe('pending');
  });

  test('should handle non-standard theme and color values', () => {
    const { result } = renderHook(() => useLocalStorageState());
    act(() => {
      result.current.setTheme('customTheme');
      result.current.setColor('#123456');
    });
    expect(result.current.theme).toBe('customTheme');
    expect(result.current.color).toBe('#123456');
    expect(document.documentElement.dataset.theme).toBe('customTheme');
    expect(document.documentElement.dataset.color).toBe('#123456');
  });

  test('should handle multiple setter calls and update localStorage each time', () => {
    const { result } = renderHook(() => useLocalStorageState());
    act(() => {
      result.current.setTimezone('UTC');
      result.current.setDateformat('YYYY-MM-DD');
      result.current.setTimeformat('HH:mm');
      result.current.setTheme('light');
      result.current.setColor('Blue');
      result.current.setLayout('grid');
      result.current.setStatus('offline');
    });

    expect(result.current).toEqual(
      expect.objectContaining({
        timezone: 'UTC',
        dateformat: 'YYYY-MM-DD',
        timeformat: 'HH:mm',
        theme: 'light',
        color: 'Blue',
        layout: 'grid',
        status: 'offline',
      })
    );
  });

  test('should correctly initialize when localStorage has all values', () => {
    localStorage.setItem('timezone', 'Asia/Kolkata');
    localStorage.setItem('dateformat', 'YYYY/MM/DD');
    localStorage.setItem('timeformat', 'HH:mm:ss');
    localStorage.setItem('theme', 'light');
    localStorage.setItem('color', 'Purple');
    localStorage.setItem('layout', 'grid');
    localStorage.setItem('status', 'active');

    const { result } = renderHook(() => useLocalStorageState());
    expect(result.current).toEqual(
      expect.objectContaining({
        timezone: 'Asia/Kolkata',
        dateformat: 'YYYY/MM/DD',
        timeformat: 'HH:mm:ss',
        theme: 'light',
        color: 'Purple',
        layout: 'grid',
        status: 'active',
      })
    );
  });
});
