import './style.scss';

// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

// import local files
import StatusPageMetricsSeparate from './separate';
import StatusPageMetricsDropdown from './dropdown';

const StatusPageMetrics = ({
  title,
  showPing,
  showName,
  monitors,
  graphType,
}) => {
  return (
    <div className="status-page-metrics-container">
      <div className="status-page-metrics-content">
        {graphType === 'Separate' ? (
          <StatusPageMetricsSeparate monitors={monitors} title={title} />
        ) : null}

        {graphType === 'Dropdown' ? (
          <StatusPageMetricsDropdown
            monitors={monitors}
            title={title}
            showName={showName}
            showPing={showPing}
          />
        ) : null}
      </div>
    </div>
  );
};

StatusPageMetrics.displayName = 'StatusPageMetrics';

StatusPageMetrics.propTypes = {
  title: PropTypes.string.isRequired,
  showPing: PropTypes.bool.isRequired,
  showName: PropTypes.bool.isRequired,
  monitors: PropTypes.array.isRequired,
  graphType: PropTypes.string.isRequired,
};

export default observer(StatusPageMetrics);
