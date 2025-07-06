// import dependencies
import { toast } from 'react-toastify';

// import local files
import { createPostRequest } from '../services/axios';
import { getSetupKeys } from '../../shared/data/setup';
import setupValidators from '../../shared/validators/setup';

const submitSetup = async (setErrors, type = 'basic', inputs) => {
  try {
    const keys = getSetupKeys(type);

    let errors = false;
    for (let key of keys) {
      const validator = setupValidators[key];
      errors = validator(inputs[key], setErrors);

      if (errors) break;
    }

    if (errors) throw new Error('Issue occured while setting up configuration');

    await createPostRequest('/auth/setup', { ...inputs, type });
    toast.success('Setup configuration successful');
  } catch (error) {
    if (error?.response?.data) {
      toast.error(error?.response?.data?.general);
    } else {
      toast.error('Error while setting up configuration');
    }

    throw error;
  }
};

export default submitSetup;
