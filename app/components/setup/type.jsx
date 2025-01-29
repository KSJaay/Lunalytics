import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import submitSetup from '../../handlers/setup';
import useSetupFormContext from '../../hooks/useSetup';

const SetupTypeForm = () => {
  const navigate = useNavigate();
  const { inputs, page, handlePageChange, setErrors } = useSetupFormContext();

  const handleSubmit = async () => {
    try {
      await submitSetup(setErrors, 'basic', inputs);
      return navigate('/home');
    } catch (error) {
      if (error?.response?.data) {
        return setErrors(error?.response?.data);
      }

      console.log(error);
      return toast.error(
        'Error occurred while creating user and setting up configuration.'
      );
    }
  };

  return (
    <>
      <div className="auth-setup-type-container">
        <div className="auth-setup-type-content" onClick={handleSubmit}>
          <div className="auth-setup-type-title">Basic Setup</div>
          <div className="auth-setup-type-subtitle">
            Continue with default settings. This will use SQLite for database
          </div>
        </div>
        <div
          className="auth-setup-type-content"
          onClick={() => handlePageChange(page.next)}
        >
          <div className="auth-setup-type-title">Advanced Setup</div>
          <div className="auth-setup-type-subtitle">
            Go through each settings and configure them to your liking.
          </div>
        </div>
      </div>
    </>
  );
};

export default SetupTypeForm;
