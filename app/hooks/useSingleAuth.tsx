// import dependencies
import { useState } from 'react';

// import local files
import validators from '../../shared/validators';

interface UseSingleAuthValues {
  inputs: Record<string, any>;
  errors: Record<string, string>;
}

type SingleAuthPage = 'email' | 'password' | 'register';

type InputChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>
  | { target: { id: string; value: any } };

const useSingleAuth = () => {
  const [values, setValues] = useState<UseSingleAuthValues>({
    inputs: {},
    errors: {},
  });

  const [page, setPage] = useState<SingleAuthPage>('email');

  const handleInputChange = (event: InputChangeEvent) => {
    const { id, value } = event.target;

    setValues((prev) => ({
      ...prev,
      inputs: { ...prev.inputs, [id]: value },
    }));
  };

  const handleInput = async (event: InputChangeEvent) => {
    const { id, value } = event.target;

    if (validators.auth[id]) {
      const isInvalid = validators.auth[id](value);

      if (isInvalid) {
        return setValues((prev) => ({
          inputs: { ...prev.inputs, [id]: value },
          errors: { ...prev.errors, ...isInvalid },
        }));
      } else {
        setValues((prev) => ({
          inputs: { ...prev.inputs, [id]: value },
          errors: { ...prev.errors, [id]: '' },
        }));
      }

      return setValues((prev) => ({
        ...prev,
        inputs: { ...prev.inputs, [id]: value?.trim() },
      }));
    }

    if (id === 'confirmPassword') {
      if (value !== values.inputs['password']) {
        setValues((prev) => ({
          ...prev,
          errors: { ...prev.errors, confirmPassword: 'Passwords do not match' },
        }));
      } else {
        setValues((prev) => ({
          ...prev,
          errors: { ...prev.errors, confirmPassword: '' },
        }));
      }

      return setValues((prev) => ({
        ...prev,
        inputs: { ...prev.inputs, confirmPassword: value },
      }));
    }
  };

  const setErrors = (errors: Record<string, string>) => {
    return setValues((prev) => ({
      ...prev,
      errors: { ...prev.errors, ...errors },
    }));
  };

  return {
    errors: values.errors,
    inputs: values.inputs,
    page,
    setPage,
    handleInput,
    handleInputChange,
    setErrors,
  };
};

export default useSingleAuth;
