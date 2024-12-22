import submitSetup from '../../handlers/setup';
import useSetupFormContext from '../../hooks/useSetup';

const SetupTypeForm = () => {
  const { inputs, page, handlePageChange, setErrors } = useSetupFormContext();

  return (
    <>
      <div className="auth-setup-type-container">
        <div
          className="auth-setup-type-content"
          onClick={() => submitSetup(setErrors, 'basic', inputs)}
        >
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
