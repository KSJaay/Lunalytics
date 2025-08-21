// import dependencies
import { useMemo } from 'react';

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
  incidents = {},
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

          const monitorIncidents = incidents[monitor.monitorId] || [];

          if (graphType === 'Pretty') {
            return (
              <StatusUptimePrettyGraph
                key={monitor.monitorId}
                monitor={monitor}
                indicator={statusIndicator}
                incidents={monitorIncidents}
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

export default StatusPageUptime;
