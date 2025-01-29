// import dependencies
import PropTypes from 'prop-types';

// import local files
import StatusLayoutLineChart from './chart/line';

const StatusConfigureLayoutMetricsTypePretty = ({ showPing, showTitle }) => {
  return (
    <div className="status-configure-layout-header-content">
      <div className="sclgp-container">
        {showTitle ? (
          <div className="sclgp-header">
            <div className="sclgp-title">{showTitle}</div>
          </div>
        ) : null}

        <div className="sclgp-stats-container">
          {showPing ? (
            <div className="sclgp-stats-content">
              <div className="sclgp-stats-item">
                <div className="sclgp-stats-title">Response Time</div>
                <div className="sclgp-stats-subtitle">120 ms</div>
              </div>

              <div className="sclgp-stats-item">
                <div className="sclgp-stats-title">Last Check</div>
                <div className="sclgp-stats-subtitle">32 secs ago</div>
              </div>
            </div>
          ) : null}

          <div
            className="status-configure-layout-metrics-content"
            style={{ flex: 1 }}
          >
            <StatusLayoutLineChart />
          </div>
        </div>
      </div>
    </div>
  );
};

StatusConfigureLayoutMetricsTypePretty.displayName =
  'StatusConfigureLayoutMetricsTypePretty';

StatusConfigureLayoutMetricsTypePretty.propTypes = {
  showPing: PropTypes.bool.isRequired,
  showTitle: PropTypes.string.isRequired,
};

export default StatusConfigureLayoutMetricsTypePretty;
