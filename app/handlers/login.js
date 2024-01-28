// import dependencies
import { toast } from 'sonner';

// import local files
import { createPostRequest } from '../services/axios';
import * as validators from '../utils/validators';

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
      return navigate('/');
    }
  } catch (error) {
    if (error?.response?.status === 418) {
      return navigate('/verify');
    }

    if (error?.response?.data?.message) {
      return setErrors(error?.response?.data?.message);
    }

    toast.error('Something went wrong');
  }
};

export default handleLogin;
