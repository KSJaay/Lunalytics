import './register.scss';

// import dependencies
import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import local files
import TextInput from '../components/ui/input';
import { createPostRequest } from '../services/axios';
import * as validators from '../utils/validators';

const Login = () => {
  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { id, value } = e.target;

    if (validators.auth[id]) {
      const isInvalid = validators.auth[id](value);

      if (isInvalid) {
        return setErrors((prev) => ({ ...prev, [id]: isInvalid }));
      } else {
        setErrors((prev) => ({ ...prev, [id]: null }));
      }
    }

    return setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { email, password } = inputs;

      const hasInvalidData =
        validators.auth.email(email) || validators.auth.password(password);

      if (hasInvalidData) {
        return setErrors(hasInvalidData);
      }

      const query = await createPostRequest('/login', { email, password });

      if (query.status === 200) {
        return navigate('/');
      }
    } catch (error) {
      if (error?.response?.status === 418) {
        return navigate('/verify');
      }

      if (error?.response?.data?.message) {
        return setErrors(error?.response?.data?.message);
      }

      toast.error('Something went wrong');
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <div className="auth-form-title">Create your account</div>
        <div className="auth-form-subtitle">
          Please provide your name and email
        </div>
        <div>
          <TextInput
            type="text"
            id="email"
            label="Email"
            error={errors['email']}
            defaultValue={inputs['email']}
            onBlur={handleInput}
          />
          <TextInput
            type="password"
            id="password"
            label="Password"
            error={errors['password']}
            defaultValue={inputs['password']}
            onBlur={handleInput}
          />
        </div>
        <button className="auth-button" onClick={handleSubmit}>
          Signin
        </button>

        <div className="auth-form-footer">
          Don&#39;t have an account?{' '}
          <a
            style={{
              fontWeight: 'bold',
              color: 'var(--primary-500)',
              textDecoration: 'underline',
            }}
            href="/register"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
