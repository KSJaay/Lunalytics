// import dependencies
import PropTypes from 'prop-types';

// import local files
import { MdErrorOutline } from '../../icons';

const AlertError = ({ title = 'Error', description }) => {
  return (
    <div className="alert-container alert-container-error">
      <div className="alert-icon-container alert-icon-container-error">
        <MdErrorOutline style={{ width: '25px', height: '25px' }} />
      </div>
      <div>
        <div className="alert-title alert-title-error">{title}</div>
        {description && <div>{description}</div>}
      </div>
    </div>
  );
};

AlertError.displayName = 'AlertError';

AlertError.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default AlertError;
