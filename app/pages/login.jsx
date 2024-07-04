import './register.scss';

// import dependencies
import { useNavigate } from 'react-router-dom';

// import local files
import TextInput from '../components/ui/input';
import useLogin from '../hooks/useLogin';
import handleLogin from '../handlers/login';

const Login = () => {
  const navigate = useNavigate();

  const { errors, inputs, handleInput, setErrors } = useLogin();

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <div className="auth-form-title">Signin to Lunalytics</div>
        <div className="auth-form-subtitle">
          Please provide your email and password
        </div>

        {errors['general'] && (
          <div className="text-input-error-general">{errors['general']}</div>
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
            type="password"
            id="password"
            label="Password"
            error={errors['password']}
            defaultValue={inputs['password']}
            onBlur={handleInput}
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
