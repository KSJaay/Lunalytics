import { toast } from 'react-toastify';

const useClipboard = () => async (text, message) => {
  if (!text) return;

  if (!navigator?.clipboard) {
    toast.error('Clipboard not supported');
    return false;
  }

  // Try to save to clipboard
  try {
    await navigator.clipboard.writeText(text);
    toast.success(
      message || 'Current translation has been copied to clipboard!'
    );
    return true;
  } catch (error) {
    toast.error('Copy failed', error);
    return false;
  }
};

export default useClipboard;
