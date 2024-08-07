// import dependencies
import PropTypes from 'prop-types';

// import local files
import MdErrorOutline from '../../icons/mdErrorOutline';

const AlertWarning = ({ title = 'Warning', description }) => {
  return (
    <div className="alert-container alert-container-warning">
      <div className="alert-icon-container alert-icon-container-warning">
        <MdErrorOutline />
      </div>
      <div>
        <div className="alert-title alert-title-warning">{title}</div>
        {description && <div>{description}</div>}
      </div>
    </div>
  );
};

AlertWarning.displayName = 'AlertWarning';

AlertWarning.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default AlertWarning;
