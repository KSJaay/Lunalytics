import '../styles/pages/register.scss';

// import dependencies
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// import local files
import RegisterEmailForm from '../components/register/email';
import RegisterPasswordForm from '../components/register/password';
import RegisterVerify from '../components/register/verify';
import useRegister from '../hooks/useRegister';
import handleRegister from '../handlers/register';
import { createGetRequest } from '../services/axios';

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
              handleRegister(inputs, setErrors, handlePageChange, navigate)
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
