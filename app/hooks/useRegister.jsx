// import dependencies
import { useState } from 'react';
import { toast } from 'react-toastify';

// import local files
import { createPostRequest } from '../services/axios';
import validators from '../../shared/validators';

const useRegister = () => {
  const [values, setValues] = useState({
    inputs: {},
    errors: {},
  });

  const [page, setPage] = useState('email');

  const handlePageChange = async (page) => {
    if (page === 'password') {
      const isInvalidEmail = validators.auth.email(values.inputs['email']);
      const isInvalidUsername = validators.auth.username(
        values.inputs['username']
      );

      if (isInvalidEmail || isInvalidUsername) {
        return setValues((prev) => ({
          ...prev,
          errors: { ...prev.errors, ...isInvalidEmail, ...isInvalidUsername },
        }));
      }

      try {
        const emailExists = await createPostRequest('/api/auth/user/exists', {
          email: values.inputs['email'],
        });

        if (emailExists.data) {
          return setValues((prev) => ({
            ...prev,
            errors: { ...prev.errors, email: 'Email already exists' },
          }));
        }
      } catch {
        return toast.error('Error occurred while checking if email exists.');
      }
    }

    return setPage(page);
  };

  const setPassword = (event) => {
    return setValues((prev) => ({
      ...prev,
      inputs: { ...prev.inputs, password: event.target.value },
    }));
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    setValues((prev) => ({
      ...prev,
      inputs: { ...prev.inputs, [id]: value },
    }));
  };

  const handleInput = async (event) => {
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

  const setErrors = (errors) => {
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
    setPassword,
  };
};

export default useRegister;
