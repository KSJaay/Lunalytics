// import dependencies
import PropTypes from 'prop-types';

// import local files
import { MdErrorOutline } from '../../icons';

const AlertInfo = ({ title = 'Info', description }) => {
  return (
    <div className="alert-container alert-container-info">
      <div className="alert-icon-container alert-icon-container-info">
        <MdErrorOutline style={{ width: '25px', height: '25px' }} />
      </div>
      <div>
        <div className="alert-title alert-title-info">{title}</div>
        {description && <div>{description}</div>}
      </div>
    </div>
  );
};

AlertInfo.displayName = 'AlertInfo';

AlertInfo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default AlertInfo;
