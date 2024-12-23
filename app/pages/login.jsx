import '../styles/pages/register.scss';

// import dependencies
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import local files
import TextInput from '../components/ui/input';
import useLogin from '../hooks/useLogin';
import handleLogin from '../handlers/login';
import { IoMdEye, IoMdEyeOff } from '../components/icons';
import { createGetRequest } from '../services/axios';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();

  const { errors, inputs, handleInput, setErrors } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkDatabaseExists = async () => {
      try {
        const query = await createGetRequest('/auth/setup/exists');

        if (!query?.ownerExists) {
          return navigate('/setup');
        }
      } catch (error) {
        console.log(error);
        return toast.error('Error occurred while checking if database exists.');
      }
    };

    checkDatabaseExists();
  }, []);

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <div className="auth-form-title">Signin to Lunalytics</div>
        <div className="auth-form-subtitle">
          Please provide your email and password
        </div>

        {errors['general'] && (
          <div className="input-error-general">{errors['general']}</div>
        )}
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
            type={showPassword ? 'text' : 'password'}
            id="password"
            label="Password"
            error={errors['password']}
            defaultValue={inputs['password']}
            onBlur={handleInput}
            iconRight={
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="auth-see-password"
              >
                {showPassword ? (
                  <IoMdEyeOff style={{ width: '25px', height: '25px' }} />
                ) : (
                  <IoMdEye style={{ width: '25px', height: '25px' }} />
                )}
              </div>
            }
          />
        </div>
        <button
          className="auth-button"
          onClick={() => handleLogin(inputs, setErrors, navigate)}
        >
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
