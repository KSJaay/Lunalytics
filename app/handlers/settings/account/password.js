import { toast } from 'sonner';

import * as validators from '../../../utils/validators';
import { createPostRequest } from '../../../services/axios';

const handleChangePassword = async ({
  currentPassword,
  newPassword,
  repeatPassword,
  handleErrors,
  closeModal,
}) => {
  try {
    if (newPassword !== repeatPassword) {
      return handleErrors('repeat', 'Password does not match.');
    }

    const isInvalid = validators.auth.password(newPassword);

    if (isInvalid) {
      return handleErrors('new', isInvalid);
    }

    const query = await createPostRequest('/api/user/update/password', {
      currentPassword,
      newPassword,
    });

    if (query.status === 200) {
      toast.success('Password changed successfully!');
      closeModal();
    }
  } catch (error) {
    if (error.response?.data?.current) {
      return handleErrors('current', error.response?.data?.current);
    }

    if (error?.response?.status === 400) {
      return handleErrors('new', error.response.data?.message);
    }

    toast.error('Something went wrong, please try again later.');
  }
};

export default handleChangePassword;
