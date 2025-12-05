// setup.test.ts

import submitSetup from '../setup';
import { createPostRequest } from '../../services/axios';
import { getSetupKeys } from '../../../shared/data/setup';
import setupValidators from '../../../shared/validators/setup';
import { toast } from 'react-toastify';

jest.mock('../../services/axios', () => ({
  createPostRequest: jest.fn(),
}));

jest.mock('../../../shared/data/setup', () => ({
  getSetupKeys: jest.fn(),
}));

jest.mock('../../../shared/validators/setup', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('submitSetup', () => {
  const setErrors = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should validate inputs, send POST request, and show success toast', async () => {
    // Mock setup keys
    (getSetupKeys as jest.Mock).mockReturnValue(['email', 'username']);

    // Mock validators: return false = no errors
    setupValidators.email = jest.fn().mockReturnValue(false);
    setupValidators.username = jest.fn().mockReturnValue(false);

    (createPostRequest as jest.Mock).mockResolvedValue({
      data: { success: true },
    });

    const inputs = {
      email: 'test@example.com',
      username: 'john',
    };

    await submitSetup(setErrors, 'basic', inputs);

    expect(getSetupKeys).toHaveBeenCalledWith('basic');

    expect(setupValidators.email).toHaveBeenCalledWith('test@example.com', setErrors);
    expect(setupValidators.username).toHaveBeenCalledWith('john', setErrors);

    expect(createPostRequest).toHaveBeenCalledWith(
      '/api/auth/setup',
      { ...inputs, type: 'basic' }
    );

    expect(toast.success).toHaveBeenCalledWith('Setup configuration successful');
  });

  test('should stop at first validation error and throw', async () => {
    (getSetupKeys as jest.Mock).mockReturnValue(['email', 'username']);

    // First validator returns true → error
    setupValidators.email = jest.fn().mockReturnValue(true);
    setupValidators.username = jest.fn();

    const inputs = { email: '', username: '' };

    await expect(submitSetup(setErrors, 'basic', inputs)).rejects.toThrow(
      'Issue occured while setting up configuration'
    );

    expect(setupValidators.email).toHaveBeenCalled();
    expect(setupValidators.username).not.toHaveBeenCalled();

    expect(toast.error).toHaveBeenCalledWith('Error while setting up configuration');
  });

  test('should show backend 422 error message if present', async () => {
    (getSetupKeys as jest.Mock).mockReturnValue(['email']);

    setupValidators.email = jest.fn().mockReturnValue(false);

    (createPostRequest as jest.Mock).mockRejectedValue({
      response: {
        data: { general: 'Backend error occurred' },
      },
    });

    const inputs = { email: 'hello@example.com' };

    await expect(submitSetup(setErrors, 'basic', inputs)).rejects.toBeTruthy();

    expect(toast.error).toHaveBeenCalledWith('Backend error occurred');
  });

  test('should show generic error if no backend message exists', async () => {
    (getSetupKeys as jest.Mock).mockReturnValue(['email']);

    setupValidators.email = jest.fn().mockReturnValue(false);

    (createPostRequest as jest.Mock).mockRejectedValue(new Error('Network down'));

    const inputs = { email: 'hello@example.com' };

    await expect(submitSetup(setErrors, 'basic', inputs)).rejects.toThrow();

    expect(toast.error).toHaveBeenCalledWith('Error while setting up configuration');
  });
});
