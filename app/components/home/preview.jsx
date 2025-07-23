import './preview.scss';

// import dependencies
import { Input, Preview } from '@lunalytics/ui';

// import local files
import { fullMonitorPropType } from '../../../shared/utils/propTypes';
import { observer } from 'mobx-react-lite';
import useContextStore from '../../context';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MonitorPreview = ({ children }) => {
  const {
    globalStore: { allMonitors = [], setActiveMonitor },
  } = useContextStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const items = useMemo(() => {
    if (!allMonitors?.length) return [];

    return allMonitors
      .filter((monitor) => {
        if (search) {
          const lowercaseSearch = search?.toLowerCase() || '';
          return (
            monitor?.name?.toLowerCase()?.includes(lowercaseSearch) ||
            monitor?.url?.toLowerCase()?.includes(lowercaseSearch)
          );
        }
        return true;
      })
      .map((monitor) => {
        return (
          <div
            className="monitor-preview-content"
            key={monitor.monitorId}
            onClick={() => {
              navigate('/home');
              setActiveMonitor(monitor.monitorId);
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>{monitor.name}</div>
              <div
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--font-light-color)',
                }}
              >
                {monitor.url}
              </div>
            </div>
          </div>
        );
      });
  }, [search, JSON.stringify(allMonitors)]);

  if (!items.length) return children;

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
        items.length > 0
          ? [input, ...items]
          : [
              input,
              <div
                style={{
                  padding: '3rem 0',
                  textAlign: 'center',
                  color: 'var(--font-light-color)',
                }}
                key="no-monitor-preview"
              >
                No monitors found
              </div>,
            ]
      }
      popupClassName="monitor-preview-container"
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
