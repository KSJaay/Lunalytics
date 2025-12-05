import handleRegister from '../register';
import validators from '../../../shared/validators';
import { createPostRequest } from '../../services/axios';
import { toast } from 'react-toastify';

jest.mock('../../services/axios', () => ({
  createPostRequest: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

describe('handleRegister', () => {
  let setErrors: jest.Mock;
  let navigate: jest.Mock;

  beforeEach(() => {
    setErrors = jest.fn();
    navigate = jest.fn();
    jest.clearAllMocks();
  });

  it('should return error if password is invalid', async () => {
    jest.spyOn(validators.auth, 'password').mockReturnValue({
      password: 'Password is not valid',
    });

    await handleRegister(
      { email: 'test@test.com', username: 'user', password: '123', confirmPassword: '123' },
      setErrors,
      navigate,
      null
    );

    expect(setErrors).toHaveBeenCalledWith({ password: 'Password is not valid' });
  });

  it('should return error if password and confirmPassword do not match', async () => {
    jest.spyOn(validators.auth, 'password').mockReturnValue(false);

    await handleRegister(
      { email: 'test@test.com', username: 'user', password: '12345678a!', confirmPassword: 'different' },
      setErrors,
      navigate,
      null
    );

    expect(setErrors).toHaveBeenCalledWith({ confirmPassword: 'Passwords do not match' });
  });

  it('should navigate to /home if registration is successful', async () => {
    jest.spyOn(validators.auth, 'password').mockReturnValue(false);
    (createPostRequest as jest.Mock).mockResolvedValue({ status: 201 });

    await handleRegister(
      { email: 'test@test.com', username: 'user', password: '12345678a!', confirmPassword: '12345678a!' },
      setErrors,
      navigate,
      null
    );

    expect(toast.success).toHaveBeenCalledWith('You have been successfully registered!');
    expect(navigate).toHaveBeenCalledWith('/home');
  });

  it('should navigate to /verify if registration status is not 201', async () => {
    jest.spyOn(validators.auth, 'password').mockReturnValue(false);
    (createPostRequest as jest.Mock).mockResolvedValue({ status: 200 });

    await handleRegister(
      { email: 'test@test.com', username: 'user', password: '12345678a!', confirmPassword: '12345678a!' },
      setErrors,
      navigate,
      null
    );

    expect(navigate).toHaveBeenCalledWith('/verify');
  });

  it('should set errors if API returns a message', async () => {
    jest.spyOn(validators.auth, 'password').mockReturnValue(false);
    (createPostRequest as jest.Mock).mockRejectedValue({
      response: { data: { message: { email: 'Email already exists' } } },
    });

    await handleRegister(
      { email: 'test@test.com', username: 'user', password: '12345678a!', confirmPassword: '12345678a!' },
      setErrors,
      navigate,
      null
    );

    expect(setErrors).toHaveBeenCalledWith({ email: 'Email already exists' });
  });

  it('should show toast error if unknown error occurs', async () => {
    jest.spyOn(validators.auth, 'password').mockReturnValue(false);
    (createPostRequest as jest.Mock).mockRejectedValue({});

    await handleRegister(
      { email: 'test@test.com', username: 'user', password: '12345678a!', confirmPassword: '12345678a!' },
      setErrors,
      navigate,
      null
    );

    expect(toast.error).toHaveBeenCalledWith('Something went wrong!');
  });
});
