// import dependencies
import { toast } from 'react-toastify';

// import local files
import { createPostRequest } from '../services/axios';
import validators from '../../shared/validators';

const handleLogin = async (inputs, setErrors, navigate) => {
  try {
    const { email, password } = inputs;

    const hasInvalidData =
      validators.auth.email(email) || validators.auth.password(password);

    if (hasInvalidData) {
      return setErrors(hasInvalidData);
    }

    const query = await createPostRequest('/auth/login', { email, password });

    if (query.status === 200) {
      return navigate('/home');
    }
  } catch (error) {
    if (error.response?.status === 418) {
      return navigate('/verify');
    }

    if (error.response?.data?.message) {
      return setErrors({ general: error.response?.data?.message });
    }

    toast.error('Something went wrong');
  }
};

export default handleLogin;
