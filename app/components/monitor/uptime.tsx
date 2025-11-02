import './uptime.scss';

// import dependencies
import dayjs from 'dayjs';
import { useMemo } from 'react';
import classNames from 'classnames';
import { Tooltip } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

// import local files
import { Table } from './table';
import useContextStore from '../../context';

const MonitorUptime = () => {
  const { t } = useTranslation();

  const {
    globalStore: { activeMonitor },
  } = useContextStore();

  const highestLatency = useMemo(() => {
    return (
      activeMonitor?.heartbeats?.reduce((acc, curr) => {
        return Math.max(acc, curr.latency);
      }, 0) || 0
    );
  }, [JSON.stringify(activeMonitor)]);

  return (
    <>
      {activeMonitor?.heartbeats && (
        <Table
          columns={[
            {
              key: 'isDown',
              label: t('home.monitor.table.status'),
              sortable: true,
              render: (value) => {
                const classes = classNames('monitor-uptime-info-button', {
                  'monitor-uptime-info-button-inactive': value,
                  'monitor-uptime-info-button-active': !value,
                });

                return (
                  <div className={classes}>
                    {value
                      ? t('home.monitor.table.down')
                      : t('home.monitor.table.up')}
                  </div>
                );
              },
            },
            {
              key: 'date',
              label: t('home.monitor.table.time'),
              sortable: true,
              render: (value) => (
                <div className="monitor-uptime-info">
                  {dayjs(new Date(value).toLocaleString('en-US', {})).format(
                    `DD/MM/YYYY HH:mm:ss`
                  )}
                </div>
              ),
            },
            {
              key: 'message',
              label: t('home.monitor.table.message'),
              sortable: true,
              defaultValue: 'Unknown',
            },
            {
              key: 'latency',
              label: t('home.monitor.headers.latency'),
              sortable: true,
              render: (value) => (
                <Tooltip
                  text={`${t('home.monitor.headers.latency')}: ${value} ms`}
                  color="gray"
                >
                  <div className="monitor-uptime-info-bar-container">
                    <div className="monitor-uptime-info-bar-content">
                      <div
                        style={{
                          width: `${Math.floor(
                            (100 / highestLatency) * value
                          )}%`,
                        }}
                        className="monitor-uptime-info-bar"
                      />
                    </div>
                  </div>
                </Tooltip>
              ),
            },
          ]}
          data={activeMonitor?.heartbeats}
          initialSortKey="date"
          initialSortDirection="desc"
        />
      )}
    </>
  );
};

MonitorUptime.displayName = 'MonitorUptime';

export default observer(MonitorUptime);
