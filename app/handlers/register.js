// import dependencies
import { toast } from 'react-toastify';

// import local files
import { createPostRequest } from '../services/axios';
import validators from '../../shared/validators';

const handleRegister = async (inputs, setErrors, setPage, navigate, invite) => {
  try {
    const { email, username, password, confirmPassword } = inputs;

    const isInvalidPassword = validators.auth.password(password);

    if (isInvalidPassword) {
      return setErrors(isInvalidPassword);
    }

    if (password !== confirmPassword) {
      return setErrors({ confirmPassword: 'Passwords do not match' });
    }

    const queryParams = invite ? { invite } : null;

    const query = await createPostRequest(
      '/api/auth/register',
      {
        email,
        username,
        password,
      },
      {},
      queryParams
    );

    toast.success('You have been successfully registered!');

    if (query.status === 201) {
      return navigate('/home');
    }

    navigate('/verify');
  } catch (error) {
    if (error?.response?.data?.message) {
      return setErrors(error?.response?.data?.message);
    }

    toast.error('Something went wrong!');
  }
};

export default handleRegister;
