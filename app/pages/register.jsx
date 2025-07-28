import '../styles/pages/register.scss';

// import dependencies
import { useNavigate, useSearchParams } from 'react-router-dom';

// import local files
import RegisterEmailForm from '../components/register/email';
import RegisterPasswordForm from '../components/register/password';
import RegisterVerify from '../components/register/verify';
import useRegister from '../hooks/useRegister';
import handleRegister from '../handlers/register';

const Register = () => {
  const {
    errors,
    inputs,
    page,
    handlePageChange,
    handleInput,
    setErrors,
    setPassword,
  } = useRegister();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

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
            handleSubmit={() =>
              handleRegister(
                inputs,
                setErrors,
                handlePageChange,
                navigate,
                searchParams.get('invite')
              )
            }
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
