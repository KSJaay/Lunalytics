// import dependencies
import { useMemo } from 'react';
import PropTypes from 'prop-types';

// import local files
import {
  StatusUptimeBasicGraph,
  StatusUptimeNerdyGraph,
  StatusUptimePrettyGraph,
} from '../layout/uptime/graph';

const StatusPageUptime = ({
  monitors = [],
  graphType = 'Basic',
  statusIndicator = 'Text',
  title = '',
}) => {
  const graphTitle = useMemo(() => title?.trim(), [title]);

  if (!monitors.length) return null;

  return (
    <div className="status-page-uptime-container">
      {graphTitle && (
        <div className="status-page-uptime-title">{graphTitle}</div>
      )}
      <div>
        {monitors.map((monitor) => {
          if (!monitor) return null;

          if (graphType === 'Pretty') {
            return (
              <StatusUptimePrettyGraph
                key={monitor.monitorId}
                monitor={monitor}
                indicator={statusIndicator}
              />
            );
          }

          if (graphType === 'Nerdy') {
            return (
              <StatusUptimeNerdyGraph
                key={monitor.monitorId}
                monitor={monitor}
                indicator={statusIndicator}
              />
            );
          }

          return (
            <StatusUptimeBasicGraph
              key={monitor.monitorId}
              monitor={monitor}
              indicator={statusIndicator}
            />
          );
        })}
      </div>
    </div>
  );
};

StatusPageUptime.displayName = 'StatusPageUptime';

StatusPageUptime.propTypes = {
  monitors: PropTypes.array.isRequired,
  graphType: PropTypes.string.isRequired,
  statusIndicator: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default StatusPageUptime;
