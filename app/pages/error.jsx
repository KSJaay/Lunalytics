import '../styles/pages/error.scss';

// import dependencies
import { useNavigate } from 'react-router-dom';
import { Button } from '@lunalytics/ui';

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="error-page-container">
      <div className="error-page-header">
        <div>4</div>
        <img src="/logo.svg" className="error-page-header-image" />
        <div>4</div>
      </div>
      <div className="error-page-subtitle">
        Sorry, couldn&#39;t find what you&#39;re looking for!
      </div>
      <Button color={'gray'} onClick={() => navigate('/home')}>
        Go to homepage
      </Button>
    </div>
  );
};

export default ErrorPage;
