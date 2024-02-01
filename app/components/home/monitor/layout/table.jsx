import './table.scss';

// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';

const MonitorTable = ({ layout, children }) => {
  const isCompact = layout === 'compact';

  const classes = classNames({
    'home-monitor-table-container-list': !isCompact,
    'home-monitor-table-container-compact': isCompact,
  });

  if (isCompact) {
    return (
      <div className="home-monitor-table">
        <div className={classes}>
          <div className="home-monitor-table-header">Name</div>
          <div className="home-monitor-table-header">Ping</div>
          <div className="home-monitor-table-header">Uptime</div>
        </div>

        <div className="home-monitor-table-content">{children}</div>
      </div>
    );
  }

  return (
    <div className="home-monitor-table">
      <div className={classes}>
        <div className="home-monitor-table-header">Name</div>
        <div className="home-monitor-table-header">Ping</div>
        <div className="home-monitor-table-header">Uptime</div>
        <div className="home-monitor-table-header">Status</div>
      </div>
      <div className="home-monitor-table-content">{children}</div>
    </div>
  );
};

MonitorTable.displayName = 'MonitorTable';

MonitorTable.propTypes = {
  layout: PropTypes.oneOf(['compact', 'list']),
  children: PropTypes.node,
};

export default MonitorTable;
