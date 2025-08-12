import '../styles/pages/register.scss';

// import dependencies
import { Input } from '@lunalytics/ui';

// import local files
import useFetch from '../hooks/useFetch';
import Loading from '../components/ui/loading';
import LoginForm from '../components/login/form';
import LoginLayout from '../components/login/layout';
import RegisterChecklist from '../components/register/checklist';
import useRegister from '../hooks/useRegister';
import { createPostRequest } from '../services/axios';

const Login = () => {
  const { isLoading, data } = useFetch({
    url: '/api/auth/config',
    onFailure: (error) => {
      console.error('Error fetching auth config:', error);
    },
  });

  const { errors, inputs, page, setPage, handleInput, handleInputChange } =
    useRegister();

  if (isLoading) {
    return <Loading />;
  }

  const providers = data?.providers?.sort() || [];

  const onSubmit = async (e) => {
    e.preventDefault();

    if (page === 'email') {
      const userExists = await createPostRequest('/api/auth/user/exists', {
        email: inputs.email,
      }).catch((error) => ({ status: error?.response?.status || 500 }));

      if (userExists.status === 200) {
        return setPage('password');
      }

      setPage('register');
    }
  };

  if (page === 'email') {
    return (
      <LoginLayout
        showProviders
        providers={providers}
        title="Welcome Back"
        subtitle="Enter your email to sign in or register"
      >
        <LoginForm onSubmit={onSubmit}>
          <Input
            title="Email"
            placeholder="example@lunalytics.xyz"
            id="email"
            value={inputs.email}
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            ksjaay@gmail.com
            <div
              style={{
                color: 'var(--primary-800)',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={() => handlePageChange('login')}
            >
              Edit email
            </div>
          </div>
        }
      >
        <LoginForm buttonText="Sign in" onSubmit={onSubmit}>
          <Input
            type="password"
            id="password"
            title="Password"
            onBlur={handleInput}
            onChange={handleInputChange}
            value={inputs.password}
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
      subtitle="Enter your details to register"
    >
      <LoginForm buttonText="Register" onSubmit={onSubmit}>
        <Input title="Username" id="username" />

        <Input type="password" id="password" title="Password" />

        <RegisterChecklist password={''} />

        <Input type="password" id="confirmPassword" title="Confirm password" />
      </LoginForm>
    </LoginLayout>
  );
};

export default Login;
