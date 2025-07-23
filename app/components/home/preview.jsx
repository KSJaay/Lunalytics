// import dependencies
import { Input, Preview } from '@lunalytics/ui';

// import local files
import { fullMonitorPropType } from '../../../shared/utils/propTypes';
import { observer } from 'mobx-react-lite';
import useContextStore from '../../context';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { filterData } from '../../../shared/utils/search';

const MonitorPreview = ({ children }) => {
  const {
    globalStore: { allMonitors = [], setActiveMonitor },
  } = useContextStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const items = useMemo(() => {
    if (!allMonitors?.length) return [];

    return filterData(allMonitors, search, ['name', 'url']).map((monitor) => {
      return (
        <div
          className="navigation-preview-content"
          key={monitor.monitorId}
          onClick={() => {
            navigate('/home');
            setActiveMonitor(monitor.monitorId);
          }}
        >
          <div className="navigation-preview-item">
            <div>{monitor.name}</div>
            <div className="navigation-preview-url">{monitor.url}</div>
          </div>
        </div>
      );
    });
  }, [search, JSON.stringify(allMonitors)]);

  const input = (
    <Input
      placeholder="Search monitors..."
      onChange={(event) => {
        setSearch(event.target.value?.trim() || '');
      }}
    />
  );

  return (
    <Preview
      items={
        !items?.length
          ? [
              input,
              <div
                className="navigation-preview-no-items"
                key="no-monitor-preview"
              >
                No monitors found
              </div>,
            ]
          : [input, ...items]
      }
      popupClassName="navigation-preview-container"
    >
      {children}
    </Preview>
  );
};

MonitorPreview.displayName = 'MonitorPreview';

MonitorPreview.propTypes = {
  monitor: fullMonitorPropType.isRequired,
};

export default observer(MonitorPreview);
