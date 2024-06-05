// import dependencies
import { toast } from 'react-toastify';

// import local files
import { createPostRequest } from '../../../services/axios';

const handleTransferAccount = async (email, closeModal) => {
  try {
    const query = await createPostRequest('/api/user/transfer/ownership', {
      email,
    });

    if (query.status === 200) {
      toast.success('Ownership successfully transferred!');
      closeModal();
    }
  } catch (error) {
    toast.error('Something went wrong, please try again later.');
  }
};

export default handleTransferAccount;
