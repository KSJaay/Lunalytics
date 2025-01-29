// import dependencies
import PropTypes from 'prop-types';

// import local files
import StatusLayoutLineChart from './chart/line';

const StatusConfigureLayoutMetricsTypeNerdy = ({ showPing, showTitle }) => {
  return (
    <div className="status-configure-layout-header-content">
      <div className="sclgn-container">
        {showTitle ? (
          <div className="sclgn-header">
            <div className="sclgn-title">{showTitle}</div>
          </div>
        ) : null}

        {showPing ? (
          <div className="sclgn-stats-container">
            <div className="sclgn-stats-content">
              <div className="sclgn-stats-title">Uptime</div>
              <div className="sclgn-stats-subtitle">99.99%</div>
            </div>
            <div className="sclgn-stats-content">
              <div className="sclgn-stats-title">Response Time</div>
              <div className="sclgn-stats-subtitle">120 ms</div>
            </div>
            <div className="sclgn-stats-content">
              <div className="sclgn-stats-title">Outages</div>
              <div className="sclgn-stats-subtitle">4 outages</div>
            </div>
            <div className="sclgn-stats-content">
              <div className="sclgn-stats-title">Last Check</div>
              <div className="sclgn-stats-subtitle">32 secs ago</div>
            </div>
          </div>
        ) : null}
        <div className="status-configure-layout-metrics-content">
          <StatusLayoutLineChart />
        </div>
      </div>
    </div>
  );
};

StatusConfigureLayoutMetricsTypeNerdy.displayName =
  'StatusConfigureLayoutMetricsTypeNerdy';

StatusConfigureLayoutMetricsTypeNerdy.propTypes = {
  showPing: PropTypes.bool.isRequired,
  showTitle: PropTypes.string.isRequired,
};

export default StatusConfigureLayoutMetricsTypeNerdy;
