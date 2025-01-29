// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';

// import local files
import {
  FaCircleCheck,
  FaClock,
  IoWarning,
  RiIndeterminateCircleFill,
} from '../../../icons';

const icons = {
  Operational: <FaCircleCheck style={{ width: '32px', height: '32px' }} />,
  Maintenance: <FaClock style={{ width: '32px', height: '32px' }} />,
  Incident: <IoWarning style={{ width: '32px', height: '32px' }} />,
  Outage: (
    <RiIndeterminateCircleFill style={{ width: '32px', height: '32px' }} />
  ),
};

const statusText = {
  Operational: 'All Systems Operational',
  Maintenance: 'Scheduled Maintenance',
  Incident: 'Partially Degraded Service',
  Outage: 'Degraded Service',
};

const StatusPageStatus = ({
  icon = true,
  design = 'Simple',
  size = 'M',
  status = 'Operational',
  titleSize = 'M',
}) => {
  const contentClasses = classNames('status-page-status-content', {
    [size]: true,
    [design]: true,
    [status]: true,
  });

  const titleClasses = classNames('status-page-status-title', {
    [titleSize]: true,
  });

  return (
    <div className="status-page-status-container">
      <div className={contentClasses}>
        <div className={titleClasses}>
          {icon ? icons[status] : null}
          {statusText[status]}
        </div>
      </div>
    </div>
  );
};

StatusPageStatus.displayName = 'StatusPageStatus';

StatusPageStatus.propTypes = {
  icon: PropTypes.bool.isRequired,
  design: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  titleSize: PropTypes.string.isRequired,
};

export default StatusPageStatus;
