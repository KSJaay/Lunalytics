// __tests__/login.test.ts
import handleLogin from '../login';
import validators from '../../../shared/validators';
import { toast } from 'react-toastify';

// Mock axios module BEFORE importing handleLogin
jest.mock('../../services/axios', () => ({
  createPostRequest: jest.fn(),
}));

import { createPostRequest } from '../../services/axios';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

describe('handleLogin', () => {
  const setErrors = jest.fn();
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call setErrors if email is invalid', async () => {
    jest.spyOn(validators.auth, 'email').mockReturnValue({ email: 'Invalid email' });
    jest.spyOn(validators.auth, 'password').mockReturnValue(false);

    await handleLogin({ email: 'wrong', password: 'Password1!' }, setErrors, navigate);

    expect(setErrors).toHaveBeenCalledWith({ email: 'Invalid email' });
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should call setErrors if password is invalid', async () => {
    jest.spyOn(validators.auth, 'email').mockReturnValue(false);
    jest.spyOn(validators.auth, 'password').mockReturnValue({ password: 'Invalid password' });

    await handleLogin({ email: 'test@test.com', password: '123' }, setErrors, navigate);

    expect(setErrors).toHaveBeenCalledWith({ password: 'Invalid password' });
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should navigate to /home if login succeeds', async () => {
    jest.spyOn(validators.auth, 'email').mockReturnValue(false);
    jest.spyOn(validators.auth, 'password').mockReturnValue(false);
    (createPostRequest as jest.Mock).mockResolvedValue({ status: 200 });

    await handleLogin({ email: 'test@test.com', password: 'Password1!' }, setErrors, navigate);

    expect(navigate).toHaveBeenCalledWith('/home');
  });

  it('should navigate to /verify if server returns 418', async () => {
    jest.spyOn(validators.auth, 'email').mockReturnValue(false);
    jest.spyOn(validators.auth, 'password').mockReturnValue(false);
    (createPostRequest as jest.Mock).mockRejectedValue({ response: { status: 418 } });

    await handleLogin({ email: 'test@test.com', password: 'Password1!' }, setErrors, navigate);

    expect(navigate).toHaveBeenCalledWith('/verify');
  });

  it('should call setErrors if server returns message', async () => {
    jest.spyOn(validators.auth, 'email').mockReturnValue(false);
    jest.spyOn(validators.auth, 'password').mockReturnValue(false);
    (createPostRequest as jest.Mock).mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    await handleLogin({ email: 'test@test.com', password: 'Password1!' }, setErrors, navigate);

    expect(setErrors).toHaveBeenCalledWith({ general: 'Invalid credentials' });
  });

  it('should call toast.error if unknown error occurs', async () => {
    jest.spyOn(validators.auth, 'email').mockReturnValue(false);
    jest.spyOn(validators.auth, 'password').mockReturnValue(false);
    (createPostRequest as jest.Mock).mockRejectedValue({});

    await handleLogin({ email: 'test@test.com', password: 'Password1!' }, setErrors, navigate);

    expect(toast.error).toHaveBeenCalledWith('Something went wrong');
  });
});
