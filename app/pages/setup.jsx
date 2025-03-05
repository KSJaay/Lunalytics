import '../styles/pages/register.scss';

// import local files
import { useSetup } from '../hooks/useSetup';
import { SetupFormStateProvider } from '../hooks/useSetup';
import SetupForm from '../components/setup';

const Setup = () => {
  const setupValues = useSetup();

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
