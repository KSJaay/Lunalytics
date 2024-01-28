// import dependencies
import { useState } from 'react';

// import local files
import * as validators from '../utils/validators';

const useLogin = () => {
  const [values, setValues] = useState({
    inputs: {},
    errors: {},
  });

  const handleInput = (event) => {
    const { id, value } = event.target;

    if (validators.auth[id]) {
      const isInvalid = validators.auth[id](value);

      if (isInvalid) {
        return setValues((prev) => ({
          ...prev,
          errors: { ...prev.errors, [id]: isInvalid },
        }));
      } else {
        setValues((prev) => ({
          ...prev,
          errors: { ...prev.errors, [id]: null },
        }));
      }
    }

    return setValues((prev) => ({
      ...prev,
      inputs: { ...prev.inputs, [id]: value },
    }));
  };

  const setErrors = (error) => {
    return setValues((prev) => ({ ...prev, errors: error }));
  };

  return {
    errors: values.errors,
    inputs: values.inputs,
    handleInput,
    setErrors,
  };
};

export default useLogin;
