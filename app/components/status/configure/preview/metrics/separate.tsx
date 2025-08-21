import './style.scss';

// import local files
import StatusPageMetricsBasicGraph from './graph/basic';
import StatusPageMetricsPrettyGraph from './graph/pretty';
import StatusPageMetricsNerdyGraph from './graph/nerdy';
import { defaultHeartbeats } from '../../../../../constant/status';

const StatusPageMetricsSeparate = ({
  monitors,
  title,
  heartbeats = defaultHeartbeats,
}) => {
  return (
    <>
      <div className="spm-title">{title}</div>
      <div className="spm-content">
        {monitors.map((monitor) => {
          const heartbeatsList =
            heartbeats[monitor?.monitorId] || defaultHeartbeats;

          if (monitor?.graphType === 'Pretty') {
            return (
              <StatusPageMetricsPrettyGraph
                key={monitor.id}
                title={monitor.title || monitor.name}
                showPing={monitor.showPing}
                heartbeats={heartbeatsList}
              />
            );
          }

          if (monitor?.graphType === 'Nerdy') {
            return (
              <StatusPageMetricsNerdyGraph
                key={monitor.id}
                title={monitor.title || monitor.name}
                showPing={monitor.showPing}
                heartbeats={heartbeatsList}
              />
            );
          }

          return (
            <StatusPageMetricsBasicGraph
              key={monitor?.id}
              title={monitor?.title || monitor?.name}
              showPing={monitor?.showPing}
              heartbeats={heartbeatsList}
            />
          );
        })}
      </div>
    </>
  );
};

StatusPageMetricsSeparate.displayName = 'StatusPageMetricsSeparate';

export default StatusPageMetricsSeparate;
