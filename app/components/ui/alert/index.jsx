import './alert.scss';

// import local files
import AlertError from './error';
import AlertInfo from './info';
import AlertSuccess from './success';
import AlertWarning from './warning';

const Alert = {
  Error: AlertError,
  Info: AlertInfo,
  Success: AlertSuccess,
  Warning: AlertWarning,
};

export { AlertError, AlertInfo, AlertSuccess, AlertWarning };

export default Alert;
