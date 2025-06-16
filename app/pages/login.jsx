import '../styles/pages/register.scss';

// import dependencies
import { useState } from 'react';
import { Input } from '@lunalytics/ui';
import { useNavigate } from 'react-router-dom';

// import local files
import useLogin from '../hooks/useLogin';
import handleLogin from '../handlers/login';
import { IoMdEye, IoMdEyeOff } from '../components/icons';

const Login = () => {
  const navigate = useNavigate();

  const { errors, inputs, handleInput, setErrors } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

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
          <Input
            type="text"
            id="email"
            title="Email"
            error={errors['email']}
            defaultValue={inputs['email']}
            onBlur={handleInput}
          />
          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            title="Password"
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
