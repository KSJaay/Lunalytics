// import dependencies
import { toast } from 'sonner';

// import local files
import { createPostRequest } from '../services/axios';
import * as validators from '../utils/validators';

const handleRegister = async (inputs, setErrors, setPage, navigate) => {
  try {
    const { email, username, password, confirmPassword } = inputs;

    const isInvalidPassword = validators.auth.password(password);

    if (isInvalidPassword) {
      return setErrors({ password: isInvalidPassword });
    }

    if (password !== confirmPassword) {
      return setErrors({ confirmPassword: 'Passwords do not match' });
    }

    const query = await createPostRequest('/auth/register', {
      email,
      username,
      password,
    });

    toast.success('You have been successfully registered!');

    if (query.status === 201) {
      return navigate('/');
    }

    setPage('verify');
  } catch (error) {
    if (error?.response?.data?.message) {
      return setErrors(error?.response?.data?.message);
    }

    toast.error('Something went wrong!');
  }
};

export default handleRegister;
