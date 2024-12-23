import '../styles/pages/register.scss';

// import dependencies
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// import local files
import { useSetup } from '../hooks/useSetup';
import { SetupFormStateProvider } from '../hooks/useSetup';
import SetupForm from '../components/setup';
import { createGetRequest } from '../services/axios';

const Setup = () => {
  const navigate = useNavigate();
  const setupValues = useSetup();

  useEffect(() => {
    const fetchOwnerExists = async () => {
      try {
        const query = await createGetRequest('/auth/setup/exists');

        if (query?.ownerExists) {
          toast.error(
            'An owner already exists, check your database and try again.'
          );
          navigate('/login');
        }
      } catch (error) {
        console.log(error);
        toast.error('Error occurred while checking if owner exists.');
      }
    };

    fetchOwnerExists();
  }, []);

  return (
    <SetupFormStateProvider value={setupValues}>
      <div className="auth-form-container">
        <div className="auth-form">
          <SetupForm />
        </div>
      </div>
    </SetupFormStateProvider>
  );
};

export default Setup;
