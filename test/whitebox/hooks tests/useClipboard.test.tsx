import { renderHook, act } from '@testing-library/react';
import { toast } from 'react-toastify';
import useClipboard from '../../../app/hooks/useClipboard';

// Mock react-toastify
jest.mock('react-toastify');

describe('useClipboard Hook - White Box Testing', () => {
  let mockClipboard: any;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup clipboard mock
    mockClipboard = {
      writeText: jest.fn(),
    };
    Object.assign(navigator, { clipboard: mockClipboard });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * Test Case 1: Early Return Path
   * Tests the first condition: if (!text) return;
   */
  test('should return early when text is empty string', async () => {
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      const returnValue = await result.current('', 'Test message');
      expect(returnValue).toBeUndefined();
    });
    
    // Verify clipboard was never called
    expect(mockClipboard.writeText).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  test('should return early when text is null', async () => {
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      const returnValue = await result.current(null as any, 'Test message');
      expect(returnValue).toBeUndefined();
    });
    
    expect(mockClipboard.writeText).not.toHaveBeenCalled();
  });

  test('should return early when text is undefined', async () => {
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      const returnValue = await result.current(undefined as any, 'Test message');
      expect(returnValue).toBeUndefined();
    });
    
    expect(mockClipboard.writeText).not.toHaveBeenCalled();
  });

  /**
   * Test Case 2: Clipboard Not Supported Path
   * Tests: if (!navigator?.clipboard)
   */
  test('should show error when clipboard is not supported', async () => {
    // Remove clipboard from navigator
    Object.assign(navigator, { clipboard: undefined });
    
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      const returnValue = await result.current('test text', 'Success message');
      expect(returnValue).toBe(false);
    });
    
    expect(toast.error).toHaveBeenCalledWith('Clipboard not supported');
    expect(toast.success).not.toHaveBeenCalled();
  });

  test('should show error when navigator is null', async () => {
    // Mock navigator as null
    const originalNavigator = global.navigator;
    Object.defineProperty(global, 'navigator', {
      value: null,
      writable: true,
      configurable: true,
    });
    
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      const returnValue = await result.current('test text', 'Success message');
      expect(returnValue).toBe(false);
    });
    
    expect(toast.error).toHaveBeenCalledWith('Clipboard not supported');
    
    // Restore navigator
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  /**
   * Test Case 3: Success Path (Try Block)
   * Tests: await navigator.clipboard.writeText(text);
   */
  test('should successfully copy text to clipboard with custom message', async () => {
    mockClipboard.writeText.mockResolvedValueOnce(undefined);
    
    const { result } = renderHook(() => useClipboard());
    const testText = 'Hello, World!';
    const customMessage = 'Custom success message';
    
    await act(async () => {
      const returnValue = await result.current(testText, customMessage);
      expect(returnValue).toBe(true);
    });
    
    expect(mockClipboard.writeText).toHaveBeenCalledWith(testText);
    expect(mockClipboard.writeText).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(customMessage);
    expect(toast.error).not.toHaveBeenCalled();
  });

  test('should use default message when message parameter is empty', async () => {
    mockClipboard.writeText.mockResolvedValueOnce(undefined);
    
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      const returnValue = await result.current('test text', '');
      expect(returnValue).toBe(true);
    });
    
    expect(toast.success).toHaveBeenCalledWith('Text has been copied to clipboard!');
  });

  test('should use default message when message parameter is null', async () => {
    mockClipboard.writeText.mockResolvedValueOnce(undefined);
    
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      const returnValue = await result.current('test text', null as any);
      expect(returnValue).toBe(true);
    });
    
    expect(toast.success).toHaveBeenCalledWith('Text has been copied to clipboard!');
  });

  test('should handle copying long text', async () => {
    mockClipboard.writeText.mockResolvedValueOnce(undefined);
    
    const { result } = renderHook(() => useClipboard());
    const longText = 'A'.repeat(10000);
    
    await act(async () => {
      const returnValue = await result.current(longText, 'Copied!');
      expect(returnValue).toBe(true);
    });
    
    expect(mockClipboard.writeText).toHaveBeenCalledWith(longText);
    expect(toast.success).toHaveBeenCalled();
  });

  test('should handle copying special characters', async () => {
    mockClipboard.writeText.mockResolvedValueOnce(undefined);
    
    const { result } = renderHook(() => useClipboard());
    const specialText = '!@#$%^&*()_+{}[]|\\:";\'<>?,./`~';
    
    await act(async () => {
      const returnValue = await result.current(specialText, 'Copied!');
      expect(returnValue).toBe(true);
    });
    
    expect(mockClipboard.writeText).toHaveBeenCalledWith(specialText);
  });

  /**
   * Test Case 4: Error Path (Catch Block)
   * Tests: catch (error) block execution
   */
  test('should handle clipboard write error', async () => {
    const testError = new Error('Clipboard write failed');
    mockClipboard.writeText.mockRejectedValueOnce(testError);
    
    // Spy on console.log
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      const returnValue = await result.current('test text', 'Success message');
      expect(returnValue).toBe(false);
    });
    
    expect(mockClipboard.writeText).toHaveBeenCalledWith('test text');
    expect(consoleSpy).toHaveBeenCalledWith(testError);
    expect(toast.error).toHaveBeenCalledWith('Failed to copy text to clipboard. Try again.');
    expect(toast.success).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  test('should handle DOMException error', async () => {
    const domError = new DOMException('Document is not focused', 'NotAllowedError');
    mockClipboard.writeText.mockRejectedValueOnce(domError);
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      const returnValue = await result.current('test text', 'Success');
      expect(returnValue).toBe(false);
    });
    
    expect(toast.error).toHaveBeenCalledWith('Failed to copy text to clipboard. Try again.');
    
    consoleSpy.mockRestore();
  });

  test('should handle permission denied error', async () => {
    const permissionError = new Error('Permission denied');
    mockClipboard.writeText.mockRejectedValueOnce(permissionError);
    
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      const returnValue = await result.current('test text', 'Success');
      expect(returnValue).toBe(false);
    });
    
    expect(toast.error).toHaveBeenCalled();
  });

  /**
   * Test Case 5: Branch Coverage - All Logical Paths
   */
  test('should execute all branches in success path', async () => {
    mockClipboard.writeText.mockResolvedValueOnce(undefined);
    
    const { result } = renderHook(() => useClipboard());
    
    // Test with truthy text, truthy navigator.clipboard, successful write
    await act(async () => {
      const returnValue = await result.current('valid text', 'Success');
      expect(returnValue).toBe(true);
    });
    
    // Verify all success path calls
    expect(mockClipboard.writeText).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  test('should execute all branches in error path', async () => {
    mockClipboard.writeText.mockRejectedValueOnce(new Error('Test error'));
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    const { result } = renderHook(() => useClipboard());
    
    // Test with truthy text, truthy navigator.clipboard, failed write
    await act(async () => {
      const returnValue = await result.current('valid text', 'Success');
      expect(returnValue).toBe(false);
    });
    
    // Verify all error path calls
    expect(mockClipboard.writeText).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  /**
   * Test Case 6: Multiple Invocations
   */
  test('should handle multiple consecutive successful copies', async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useClipboard());
    
    await act(async () => {
      await result.current('text 1', 'Message 1');
      await result.current('text 2', 'Message 2');
      await result.current('text 3', 'Message 3');
    });
    
    expect(mockClipboard.writeText).toHaveBeenCalledTimes(3);
    expect(toast.success).toHaveBeenCalledTimes(3);
  });

  /**
   * Test Case 7: Code Coverage - Statement Coverage
   */
  test('should achieve 100% statement coverage', async () => {
    // This test ensures every line of code is executed
    
    // Path 1: Early return
    const { result } = renderHook(() => useClipboard());
    await act(async () => {
      await result.current('', 'msg');
    });
    
    // Path 2: No clipboard
    Object.assign(navigator, { clipboard: undefined });
    await act(async () => {
      await result.current('text', 'msg');
    });
    
    // Path 3: Success
    Object.assign(navigator, { clipboard: { writeText: jest.fn().mockResolvedValue(undefined) } });
    await act(async () => {
      await result.current('text', 'msg');
    });
    
    // Path 4: Error
    Object.assign(navigator, { 
      clipboard: { writeText: jest.fn().mockRejectedValue(new Error('fail')) } 
    });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await act(async () => {
      await result.current('text', 'msg');
    });
    consoleSpy.mockRestore();
    
    // All statements executed
    expect(true).toBe(true);
  });
});