// import dependencies
import { toast } from 'react-toastify';

// import local files
import * as validators from '../../../utils/validators';
import { createPostRequest } from '../../../services/axios';

const handleChangeUsername = async (
  displayName,
  setError,
  closeModal,
  handleErrors
) => {
  try {
    const isInvalid = validators.auth.username(displayName);

    if (isInvalid) {
      return setError(isInvalid);
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
    if (error.response?.data?.current) {
      return handleErrors('current', error.response?.data?.current);
    }

    if (error?.response?.status === 400) {
      return handleErrors('new', error.response.data?.message);
    }

    toast.error('Something went wrong, please try again later.');

    return false;
  }
};

export default handleChangeUsername;
