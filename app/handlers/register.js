// import dependencies
import { toast } from 'sonner';

// import local files
import { createPostRequest } from '../services/axios';

const handleRegister = async (inputs, setErrors, setPage) => {
  try {
    const { email, username, password } = inputs;

    await createPostRequest('/auth/register', { email, username, password });
    toast.success('You have been successfully registered!');
    setPage('verify');
  } catch (error) {
    if (error?.response?.data?.message) {
      setErrors((prev) => ({
        ...prev,
        ...error?.response?.data?.message,
      }));
    }
  }
};

export default handleRegister;
