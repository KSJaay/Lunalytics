// import dependencies
import dayjs from 'dayjs';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const StatusPageHeaderStatus = ({ status = {} }) => {
  if (!status.showLogo && !status.showTitle) {
    return null;
  }

  const containerClasses = classNames('spht-status-container', {
    [status.alignment]: true,
    [`position-${status.position}`]: true,
  });

  const titleClasses = classNames('spht-status-title', {
    [status.titleSize]: status.showTitle,
  });

  const subtitleClasses = classNames('spht-status-subtitle', {
    [status.statusSize]: status.showStatus,
  });

  return (
    <a className={containerClasses}>
      {status.showStatus && <div className={titleClasses}>Service Status</div>}
      {status.showTitle && (
        <div className={subtitleClasses}>
          Last check: {dayjs().format('HH:mm:ss')}
        </div>
      )}
    </a>
  );
};

StatusPageHeaderStatus.displayName = 'StatusPageHeaderStatus';

StatusPageHeaderStatus.propTypes = {
  status: PropTypes.object.isRequired,
};

export default StatusPageHeaderStatus;
