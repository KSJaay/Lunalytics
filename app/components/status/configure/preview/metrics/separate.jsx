import './style.scss';

// import dependencies
import PropTypes from 'prop-types';

// import local files
import StatusPageMetricsBasicGraph from './graph/basic';
import StatusPageMetricsPrettyGraph from './graph/pretty';
import StatusPageMetricsNerdyGraph from './graph/nerdy';
import { defaultHeartbeats } from '../../../../../constant/status';

const StatusPageMetricsSeparate = ({ monitors, title }) => {
  return (
    <>
      <div className="status-page-metrics-title">{title}</div>
      <div className="status-page-metrics-content">
        {monitors.map((monitor) => {
          if (monitor.graphType === 'Basic') {
            return (
              <StatusPageMetricsBasicGraph
                key={monitor.id}
                title={monitor.title}
                showPing={monitor.showPing}
                heartbeats={defaultHeartbeats}
              />
            );
          }

          if (monitor.graphType === 'Pretty') {
            return (
              <StatusPageMetricsPrettyGraph
                key={monitor.id}
                title={monitor.title}
                showPing={monitor.showPing}
                heartbeats={defaultHeartbeats}
              />
            );
          }

          if (monitor.graphType === 'Nerdy') {
            return (
              <StatusPageMetricsNerdyGraph
                key={monitor.id}
                title={monitor.title}
                showPing={monitor.showPing}
                heartbeats={defaultHeartbeats}
              />
            );
          }
        })}
      </div>
    </>
  );
};

StatusPageMetricsSeparate.displayName = 'StatusPageMetricsSeparate';

StatusPageMetricsSeparate.propTypes = {
  monitors: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default StatusPageMetricsSeparate;
