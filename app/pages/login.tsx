import '../styles/pages/login.scss';

// import dependencies
import { toast } from 'react-toastify';
import { Input } from '@lunalytics/ui';
import { useNavigate, useSearchParams } from 'react-router-dom';

// import local files
import useFetch from '../hooks/useFetch';
import handleLogin from '../handlers/login';
import useSingleAuth from '../hooks/useSingleAuth';
import Loading from '../components/ui/loading';
import LoginForm from '../components/login/form';
import handleRegister from '../handlers/register';
import LoginLayout from '../components/login/layout';
import { createPostRequest } from '../services/axios';
import RegisterChecklist from '../components/register/checklist';

interface EditEmailProps extends React.HTMLAttributes<HTMLDivElement> {
  email: string;
}

const EditEmail = ({ email, ...props }: EditEmailProps) => (
  <div className="login-header-subtitle">
    {email}
    <div className="login-header-subtitle-link" {...props}>
      Edit email
    </div>
  </div>
);

const Login = () => {
  const [searchParams] = useSearchParams();
  const { isLoading, data } = useFetch({
    url: '/api/auth/config',
    onFailure: (error) => {
      console.error('Error fetching auth config:', error);
    },
  });

  const {
    errors,
    inputs,
    page,
    setPage,
    handleInput,
    handleInputChange,
    setErrors,
  } = useSingleAuth();

  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }

  const providers = data?.providers?.sort() || [];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (page === 'email') {
        const userExists = await createPostRequest('/api/auth/user/exists', {
          email: inputs.email,
        }).catch((error) => ({ status: error?.response?.status || 500 }));

        if (userExists.status === 200) {
          return setPage('password');
        }

        setPage('register');
      }

      if (page === 'password') {
        await handleLogin(inputs, setErrors, navigate);
      }

      if (page === 'register') {
        await handleRegister(
          inputs,
          setErrors,
          navigate,
          searchParams.get('invite')
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(
        'An error occurred during data submission. Please try again.'
      );
    }
  };

  if (page === 'email') {
    return (
      <LoginLayout
        showProviders
        providers={providers}
        title="Welcome Back"
        subtitle={
          <>
            <div>Enter your email to sign in or register</div>
            {errors['general'] && (
              <div className="input-error-general">{errors['general']}</div>
            )}
          </>
        }
      >
        <LoginForm onSubmit={onSubmit}>
          <Input
            title="Email"
            placeholder="example@lunalytics.xyz"
            id="email"
            value={inputs.email || ''}
            error={errors.email}
            onBlur={handleInput}
            onChange={handleInputChange}
          />
        </LoginForm>
      </LoginLayout>
    );
  }

  if (page === 'password') {
    return (
      <LoginLayout
        onSubmit={onSubmit}
        title="Enter password"
        subtitle={
          <>
            <EditEmail
              email={inputs.email}
              onClick={() => {
                handleInputChange({ target: { id: 'password', value: '' } });
                setPage('email');
                return;
              }}
            />
            {errors['general'] && (
              <div className="input-error-general">{errors['general']}</div>
            )}
          </>
        }
      >
        <LoginForm buttonText="Sign in" onSubmit={onSubmit}>
          <Input
            type="password"
            id="password"
            title="Password"
            onBlur={handleInput}
            onChange={handleInputChange}
            value={inputs.password || ''}
            error={errors.password}
          />
        </LoginForm>
      </LoginLayout>
    );
  }

  return (
    <LoginLayout
      onSubmit={onSubmit}
      title="Enter details"
      subtitle={
        <>
          <div>Enter your details to register</div>

          <EditEmail
            email={inputs.email}
            onClick={() => {
              handleInputChange({ target: { id: 'password', value: '' } });
              handleInputChange({
                target: { id: 'confirmPassword', value: '' },
              });
              setPage('email');
            }}
          />

          {errors['general'] && (
            <div className="input-error-general">{errors['general']}</div>
          )}
        </>
      }
    >
      <LoginForm buttonText="Register" onSubmit={onSubmit}>
        <Input
          title="Username"
          id="username"
          onBlur={handleInput}
          onChange={handleInputChange}
          value={inputs.username || ''}
          error={errors.username}
        />

        <Input
          type="password"
          id="password"
          title="Password"
          onBlur={handleInput}
          onChange={handleInputChange}
          value={inputs.password || ''}
          error={errors.password}
        />

        <RegisterChecklist password={inputs.password} />

        <Input
          type="password"
          id="confirmPassword"
          title="Confirm password"
          onBlur={handleInput}
          onChange={handleInputChange}
          value={inputs.confirmPassword || ''}
          error={errors.confirmPassword}
        />
      </LoginForm>
    </LoginLayout>
  );
};

export default Login;
