// import styles
import './monitor.scss';

// import dependencies
import PropTypes from 'prop-types';

const MonitorForm = ({ title, error, children, ...props }) => {
  return (
    <div className="monitor-form-container">
      <form className="monitor-form" {...props}>
        {title && <div className="monitor-form-title">{title}</div>}
        {error && <div className="monitor-form-error">{error}</div>}
        <div>{children}</div>
        <button type="submit" className="monitor-button">
          {title}
        </button>
      </form>
    </div>
  );
};

MonitorForm.displayName = 'MonitorForm';

MonitorForm.propTypes = {
  title: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node,
};

export default MonitorForm;
