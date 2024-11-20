import './table.scss';

// import dependencies
import PropTypes from 'prop-types';

const MonitorTable = ({ children }) => {
  return (
    <div className="home-monitor-table">
      <div className="home-monitor-table-container-list">
        <div className="home-monitor-table-header">Name</div>
        <div className="home-monitor-table-header">Ping</div>
        <div className="home-monitor-table-header-uptime">Uptime</div>
        <div className="home-monitor-table-header-status">Status</div>
      </div>
      <div className="home-monitor-table-content">{children}</div>
    </div>
  );
};

MonitorTable.displayName = 'MonitorTable';

MonitorTable.propTypes = {
  children: PropTypes.node,
};

export default MonitorTable;
