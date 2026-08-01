// import dependencies
import { toast } from 'react-toastify';

// import local files
import { createPostRequest } from '../services/axios';
import { getSetupKeys } from '../../shared/data/setup';
import setupValidators from '../../shared/validators/setup';

const submitSetup = async (
  setErrors: (errors: Record<string, string>) => void,
  type: 'basic' | 'advanced' = 'basic',
  inputs: Record<string, any>
) => {
  try {
    const keys = getSetupKeys(type);

    let errors = false;
    for (let key of keys) {
      const validator =
        typeof setupValidators[key as keyof typeof setupValidators] ===
        'function'
          ? setupValidators[key as keyof typeof setupValidators]
          : null;
      errors =
        typeof validator === 'function'
          ? validator(inputs[key], setErrors, inputs['password'])
          : false;

      if (errors) break;
    }

    if (errors) throw new Error('Issue occured while setting up configuration');

    await createPostRequest('/api/auth/setup', { ...inputs, type });
    toast.success('Setup configuration successful');
  } catch (error: any) {
    if (error?.response?.data) {
      toast.error(error?.response?.data?.general);
    } else {
      toast.error('Error while setting up configuration');
    }

    throw error;
  }
};

export default submitSetup;
