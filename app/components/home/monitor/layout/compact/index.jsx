import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';
import Monitor from '../../../../../pages/monitor';

const MonitorCompact = ({ children, monitor_id }) => {
  return (
    <div className="home-monitor-compact">
      <div
        className="home-monitor-table"
        style={{
          backgroundColor: 'var(--accent-900)',
          justifyContent: 'flex-start',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div className="home-monitor-table-container-compact">
          <div className="home-monitor-table-header">Name</div>
        </div>

        <div className="home-monitor-compact-table-content">{children}</div>
      </div>
      <div className="home-monitor-compact-content">
        {monitor_id && <Monitor monitor_id={monitor_id} />}

        {!monitor_id && (
          <div className="home-monitor-compact-content-empty">
            Select a monitor
          </div>
        )}
      </div>
    </div>
  );
};

MonitorCompact.displayName = 'MonitorCompact';
MonitorCompact.propTypes = {
  children: PropTypes.node,
  monitor_id: PropTypes.string,
};

export default MonitorCompact;
