// import dependencies
import { toast } from 'react-toastify';

// import local files
import validators from '../../../../shared/validators';
import { createPostRequest } from '../../../services/axios';

const handleChangeUsername = async (displayName, handleError, closeModal) => {
  try {
    const isInvalid = validators.auth.username(displayName);

    if (isInvalid) {
      return handleError(isInvalid.username);
    }

    const query = await createPostRequest('/api/user/update/username', {
      displayName,
    });

    if (query.status === 200) {
      toast.success('Username changed successfully!');
      closeModal();
    }

    return true;
  } catch (error) {
    if (error.response?.data?.username) {
      return handleError(error.response?.data?.username);
    }

    toast.error('Something went wrong, please try again later.');

    return false;
  }
};

export default handleChangeUsername;
