// import dependencies
import { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input, Preview } from '@lunalytics/ui';

// import local files
import useContextStore from '../../context';
import { filterData } from '../../../shared/utils/search';
import type { ContextMonitorProps } from '../../types/context/global';

const MonitorPreview = ({ children }: { children: React.ReactNode }) => {
  const {
    globalStore: { allMonitors = [], setActiveMonitor },
  } = useContextStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const items = useMemo(() => {
    if (!allMonitors?.length) return [];

    return filterData(allMonitors, search, ['name', 'url']).map(
      (monitor: ContextMonitorProps) => {
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
      }
    );
  }, [search, JSON.stringify(allMonitors)]);

  const input = (
    <Input
      placeholder={t('home.search')}
      key="search"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
                {t('home.monitor.none_exist')}
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

export default observer(MonitorPreview);
