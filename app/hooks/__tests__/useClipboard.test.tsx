import useClipboard from '../useClipboard';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useClipboard Hook', () => {
  let mockWrite: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockWrite = jest.fn();

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: { writeText: mockWrite },
    });
  });

  test('returns undefined if no text passed', async () => {
    const copy = useClipboard();
    const res = await copy('', 'test');
    expect(res).toBeUndefined();
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  test('shows error if clipboard is not supported', async () => {
    Object.assign(navigator, { clipboard: undefined });
    const copy = useClipboard();
    const res = await copy('Some text', 'Message');
    expect(res).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Clipboard not supported');
  });

  test('copies text successfully and shows success toast', async () => {
    mockWrite.mockResolvedValueOnce(undefined);
    const copy = useClipboard();
    const result = await copy('Copied!', 'Copied message');

    expect(mockWrite).toHaveBeenCalledWith('Copied!');
    expect(toast.success).toHaveBeenCalledWith('Copied message');
    expect(result).toBe(true);
  });

  test('handles clipboard write error and shows error toast', async () => {
    mockWrite.mockRejectedValueOnce('err');

    const copy = useClipboard();
    const result = await copy('Hello', 'msg');

    expect(mockWrite).toHaveBeenCalledWith('Hello');
    expect(toast.error).toHaveBeenCalledWith(
      'Failed to copy text to clipboard. Try again.'
    );
    expect(result).toBe(false);
  });
});
