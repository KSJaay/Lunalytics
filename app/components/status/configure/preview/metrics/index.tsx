import './style.scss';

// import dependencies
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
  heartbeats,
}) => {
  return (
    <div className="spm-container">
      <div className="spm-content">
        {graphType === 'Separate' ? (
          <StatusPageMetricsSeparate
            monitors={monitors}
            title={title}
            showName={showName}
            showPing={showPing}
            heartbeats={heartbeats}
          />
        ) : null}

        {graphType === 'Dropdown' ? (
          <StatusPageMetricsDropdown
            monitors={monitors}
            title={title}
            showName={showName}
            showPing={showPing}
            heartbeats={heartbeats}
          />
        ) : null}
      </div>
    </div>
  );
};

StatusPageMetrics.displayName = 'StatusPageMetrics';



export default observer(StatusPageMetrics);
