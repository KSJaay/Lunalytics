import { toast } from 'react-toastify';

const useClipboard = () => async (text: string, message: string) => {
  if (!text) return;

  if (!navigator?.clipboard) {
    toast.error('Clipboard not supported');
    return false;
  }

  // Try to save to clipboard
  try {
    await navigator.clipboard.writeText(text);
    toast.success(message || 'Text has been copied to clipboard!');
    return true;
  } catch {
    toast.error('Failed to copy text to clipboard. Try again.');
    return false;
  }
};

export default useClipboard;
