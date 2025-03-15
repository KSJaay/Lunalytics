// import dependencies
import PropTypes from 'prop-types';

// import local files
import StatusLayoutLineChart from './chart/line';

const StatusConfigureLayoutMetricsTypeBasic = ({ showPing, showTitle }) => {
  return (
    <div className="sclh-content">
      <div className="sclgb-content">
        {showTitle || showPing ? (
          <div className="sclgb-header">
            <div className="sclgb-title">{showTitle ? showTitle : null}</div>
            {showPing && <div className="sclgb-subtitle ">30 ms</div>}
          </div>
        ) : null}
        <div className="sclm-content">
          <StatusLayoutLineChart />
        </div>
      </div>
    </div>
  );
};

StatusConfigureLayoutMetricsTypeBasic.displayName =
  'StatusConfigureLayoutMetricsTypeBasic';

StatusConfigureLayoutMetricsTypeBasic.propTypes = {
  showPing: PropTypes.bool.isRequired,
  showTitle: PropTypes.string.isRequired,
};

export default StatusConfigureLayoutMetricsTypeBasic;
