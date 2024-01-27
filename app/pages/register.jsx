import './register.scss';

// import dependencies
import { toast } from 'sonner';
import { useState } from 'react';

// import local files
import { createPostRequest } from '../services/axios';
import * as validators from '../utils/validators';
import RegisterEmailForm from '../components/register/email';
import RegisterPasswordForm from '../components/register/password';
import RegisterVerify from '../components/register/verify';

const Register = () => {
  const [page, setPage] = useState('email');
  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState({});

  const handlePageChange = async (page) => {
    if (page === 'password') {
      const isInvalidEmail = validators.auth.email(inputs['email']);
      const isInvalidUsername = validators.auth.username(inputs['username']);

      if (isInvalidEmail || isInvalidUsername) {
        return setErrors((prev) => ({
          ...prev,
          email: isInvalidEmail,
          username: isInvalidUsername,
        }));
      }

      try {
        const emailExists = await createPostRequest('/api/user/exists', {
          email: inputs['email'],
        });

        if (emailExists.data) {
          return setErrors((prev) => ({
            ...prev,
            email: 'Someone else is already using this email.',
          }));
        }
      } catch (error) {
        return toast.error('Error occurred while checking if email exists.');
      }
    }

    return setPage(page);
  };

  const setPassword = (event) => {
    setInputs((prev) => ({ ...prev, password: event.target.value?.trim() }));
  };

  const handleInput = async (e) => {
    const { id, value } = e.target;

    if (validators.auth[id]) {
      const isInvalid = validators.auth[id](value);

      if (isInvalid) {
        setErrors((prev) => ({ ...prev, [id]: isInvalid }));
      } else {
        setErrors((prev) => ({ ...prev, [id]: '' }));
      }

      return setInputs((prev) => ({ ...prev, [id]: value?.trim() }));
    }

    if (id === 'confirmPassword') {
      if (value !== inputs['password']) {
        setErrors((prev) => ({
          ...prev,
          [id]: 'Passwords do not match',
        }));
      } else {
        setErrors((prev) => ({ ...prev, [id]: '' }));
      }

      return setInputs((prev) => ({ ...prev, [id]: value?.trim() }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { email, username, password } = inputs;

      await createPostRequest('/register', { email, username, password });
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

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        {page === 'email' && (
          <RegisterEmailForm
            handleInput={handleInput}
            handlePageChange={handlePageChange}
            inputs={inputs}
            errors={errors}
          />
        )}
        {page === 'password' && (
          <RegisterPasswordForm
            handleInput={handleInput}
            handleSubmit={handleSubmit}
            setPassword={setPassword}
            inputs={inputs}
            errors={errors}
          />
        )}
        {page === 'verify' && <RegisterVerify />}
      </div>
    </div>
  );
};

export default Register;
