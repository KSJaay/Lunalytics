import './status.scss';

// import dependencies
import { useTranslation } from 'react-i18next';

// import local files
import type { ContextMonitorProps } from '../../../shared/types/context/global';

const MonitorStatus = ({
  monitor,
}: {
  monitor: ContextMonitorProps | null | undefined;
}) => {
  const [lastHeartbeat] = monitor?.heartbeats || [];
  const { t } = useTranslation();

  if (!monitor) return null;

  return (
    <div className="monitor-status-container">
      <div className="monitor-status-content">
        <div className="monitor-status-title">
          {t('home.monitor.headers.response')}
        </div>
        <div className="monitor-status-subtitle">
          ({t('home.monitor.headers.current')})
        </div>
        <div className="monitor-status-text">{lastHeartbeat?.latency}ms</div>
      </div>
      <div className="monitor-status-content">
        <div className="monitor-status-title">
          {t('home.monitor.headers.avg_response')}
        </div>
        <div className="monitor-status-subtitle">(24 {t('common.hours')})</div>
        <div className="monitor-status-text">
          {monitor.averageHeartbeatLatency || 0}ms
        </div>
      </div>
      <div className="monitor-status-content">
        <div className="monitor-status-title">
          {t('home.monitor.headers.uptime')}
        </div>
        <div className="monitor-status-subtitle">(24 {t('common.hours')})</div>
        <div className="monitor-status-text">
          {monitor.uptimePercentage || 0}%
        </div>
      </div>
      {monitor.type === 'ping' ||
      monitor.type === 'push' ||
      monitor.type === 'docker' ? null : (
        <div className="monitor-status-content">
          <div className="monitor-status-title">
            {t('home.monitor.headers.cert_expiry')}
          </div>
          <div className="monitor-status-subtitle">
            ({t('home.monitor.headers.days_left')})
          </div>
          <div className="monitor-status-text">
            {monitor.url?.startsWith('http://')
              ? t('common.invalid')
              : monitor.cert?.isValid
              ? `${monitor.cert.daysRemaining}`
              : t('common.expired')}
          </div>
        </div>
      )}
    </div>
  );
};

MonitorStatus.displayName = 'MonitorStatus';

export default MonitorStatus;
