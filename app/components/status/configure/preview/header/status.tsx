// import dependencies
import dayjs from 'dayjs';
import classNames from 'classnames';

const StatusPageHeaderStatus = ({ status = {}, lastUpdated }) => {
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
          Last check: {dayjs(lastUpdated).format('HH:mm:ss')}
        </div>
      )}
    </a>
  );
};

StatusPageHeaderStatus.displayName = 'StatusPageHeaderStatus';

export default StatusPageHeaderStatus;
