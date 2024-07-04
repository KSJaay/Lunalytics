import './error.scss';

// import local files
import Button from '../components/ui/button';

const ErrorPage = () => {
  return (
    <div className="error-page-container">
      <div className="error-page-header">
        <div>4</div>
        <img src={'/logo.svg'} className="error-page-header-image" />
        <div>4</div>
      </div>
      <div className="error-page-subtitle">
        Sorry, couldn&#39;t find what you&#39;re looking for!
      </div>
      <Button color={'gray'} as="a" href="/">
        Go to homepage
      </Button>
    </div>
  );
};

export default ErrorPage;
