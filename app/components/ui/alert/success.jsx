// import dependencies
import PropTypes from 'prop-types';

// import local files
import { MdErrorOutline } from '../../icons';

const AlertSuccess = ({ title = 'Success', description }) => {
  return (
    <div className="alert-container alert-container-success">
      <div className="alert-icon-container alert-icon-container-success">
        <MdErrorOutline style={{ width: '25px', height: '25px' }} />
      </div>
      <div>
        <div className="alert-title alert-title-success">{title}</div>
        {description && <div>{description}</div>}
      </div>
    </div>
  );
};

AlertSuccess.displayName = 'AlertSuccess';

AlertSuccess.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default AlertSuccess;
