import './index.scss';

import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';

import useContextStore from '../../../context';
import { useTranslation } from 'react-i18next';
import type { CertificateProps, MonitorProps } from '../../../types/monitor';

const notificationText = {
  basic: 'Basic',
  pretty: 'Pretty',
  nerdy: 'Nerdy',
};

const MonitorCertificate = ({
  certificate,
}: {
  certificate: CertificateProps;
}) => {
  const { t } = useTranslation();

  if (!certificate || !certificate.isValid) return null;

  return (
    <>
      <div className="navigation-info-subtitle">{t('common.certificate')}</div>

      <div className="navigation-info-list">
        <div className="navigation-info-item">
          <div>{t('common.valid')}</div>
          <div>{certificate.isValid ? 'True' : 'False'}</div>
        </div>

        <div className="navigation-info-item">
          <div>{t('home.info.created_at')}</div>
          <div>
            {dayjs(certificate.validFrom).format('DD-MM-YYYY HH:mm:ss')}
          </div>
        </div>

        <div className="navigation-info-item">
          <div>{t('home.info.expires_at')}</div>
          <div>
            {dayjs(certificate.validTill).format('DD-MM-YYYY HH:mm:ss')}
          </div>
        </div>

        <div className="navigation-info-item">
          <div>{t('home.info.days_remaining')}</div>
          <div>
            {certificate.daysRemaining} {t('common.days')}
          </div>
        </div>

        <div className="navigation-info-item">
          <div style={{ alignItems: 'flex-start' }}>
            {t('home.info.valid_on')}
          </div>
          <div>{certificate.validOn?.join('\n') || t('common.unknown')}</div>
        </div>
      </div>
    </>
  );
};

const MonitorNotification = observer(
  ({
    notificationId,
    notificationType,
  }: {
    notificationId: string;
    notificationType: string;
  }) => {
    const {
      notificationStore: { getNotifciationById },
    } = useContextStore();

    const { t } = useTranslation();

    if (!notificationId) return null;

    const notification = getNotifciationById(notificationId);

    if (!notification) return null;

    return (
      <>
        <div className="navigation-info-subtitle">
          {t('common.notification')}
        </div>

        <div className="navigation-info-list">
          <div className="navigation-info-item">
            <div>{t('common.name')}</div>
            <div>{notification.friendlyName}</div>
          </div>

          <div className="navigation-info-item">
            <div>{t('common.id')}</div>
            <div>{notification.id}</div>
          </div>

          <div className="navigation-info-item">
            <div>{t('common.platform')}</div>
            <div>{notification.platform}</div>
          </div>

          <div className="navigation-info-item">
            <div>{t('common.format')}</div>
            <div>{notificationText[notification.messageType]}</div>
          </div>

          <div className="navigation-info-item">
            <div>{t('common.type')}</div>
            <div>{notificationType}</div>
          </div>
        </div>
      </>
    );
  }
);

const NavigationMonitorInfo = ({ monitor }: { monitor: MonitorProps }) => {
  const { t } = useTranslation();

  if (!monitor) return null;

  return (
    <>
      <div className="navigation-info-title">{t('home.info.title')}</div>

      <div className="navigation-info-list">
        <div className="navigation-info-item">
          <div>{t('common.name')}</div>
          <div>{monitor.name}</div>
        </div>

        <div className="navigation-info-item">
          <div>{t('home.info.monitor_id')}</div>
          <div>{monitor.monitorId}</div>
        </div>

        <div className="navigation-info-item">
          <div>{t('home.info.url')}</div>
          <div>
            {monitor.type !== 'tcp'
              ? monitor.url
              : `${monitor.url}:${monitor.port}`}
          </div>
        </div>

        {monitor.method ? (
          <div className="navigation-info-item">
            <div>{t('home.info.method')}</div>
            <div>{monitor.method}</div>
          </div>
        ) : null}

        {monitor.type === 'http' ? (
          <div className="navigation-info-item">
            <div>{t('home.info.valid_status_codes')}</div>
            <div>
              {monitor.valid_status_codes?.join(', ') || t('common.none')}
            </div>
          </div>
        ) : null}

        <div className="navigation-info-item">
          <div>{t('home.info.creator')}</div>
          <div>{monitor.email}</div>
        </div>

        <div className="navigation-info-item">
          <div>{t('home.info.paused')}</div>
          <div>{monitor.paused ? t('common.true') : t('common.false')}</div>
        </div>

        <div className="navigation-info-item">
          <div>{t('home.info.created_at')}</div>
          <div>{dayjs(monitor.createdAt).format('DD-MM-YYYY HH:mm:ss')}</div>
        </div>
      </div>

      <div className="navigation-info-subtitle">
        {t('home.info.intervals.interval')}
      </div>

      <div className="navigation-info-list">
        <div className="navigation-info-item">
          <div>{t('home.info.intervals.request')}</div>
          <div>
            {monitor.interval} {t('common.seconds')}
          </div>
        </div>

        <div className="navigation-info-item">
          <div>{t('home.info.intervals.timeout')}</div>
          <div>
            {monitor.requestTimeout} {t('common.seconds')}
          </div>
        </div>

        <div className="navigation-info-item">
          <div>{t('home.info.intervals.retry_interval')}</div>
          <div>
            {monitor.retryInterval} {t('common.seconds')}
          </div>
        </div>

        <div className="navigation-info-item">
          <div>{t('home.info.intervals.retry')}</div>
          <div>
            {monitor.retryInterval} {t('common.seconds')}
          </div>
        </div>
      </div>

      <MonitorCertificate certificate={monitor.cert} />

      <MonitorNotification
        notificationId={monitor.notificationId}
        notificationType={monitor.notificationType}
      />
    </>
  );
};

export default NavigationMonitorInfo;
