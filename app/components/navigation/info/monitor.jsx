import './index.scss';

import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';

import useContextStore from '../../../context';

const notificationText = {
  basic: 'Basic',
  pretty: 'Pretty',
  nerdy: 'Nerdy',
};

const MonitorCertificate = ({ certificate }) => {
  if (!certificate || !certificate.isValid) return null;

  return (
    <>
      <div className="navigation-info-subtitle">Certificate</div>

      <div className="navigation-info-list">
        <div className="navigation-info-item">
          <div>Valid</div>
          <div>{certificate.isValid ? 'True' : 'False'}</div>
        </div>

        <div className="navigation-info-item">
          <div>Created At</div>
          <div>
            {dayjs(certificate.validFrom).format('DD-MM-YYYY HH:mm:ss')}
          </div>
        </div>

        <div className="navigation-info-item">
          <div>Expires At</div>
          <div>
            {dayjs(certificate.validTill).format('DD-MM-YYYY HH:mm:ss')}
          </div>
        </div>

        <div className="navigation-info-item">
          <div>Days Remaining</div>
          <div>{certificate.daysRemaining} days</div>
        </div>

        <div className="navigation-info-item">
          <div style={{ alignItems: 'flex-start' }}>Valid On</div>
          <div>{certificate.validOn?.join('\n') || 'Unknown'}</div>
        </div>
      </div>
    </>
  );
};

const MonitorNotification = observer(({ notificationId, notificationType }) => {
  const {
    notificationStore: { getNotifciationById },
  } = useContextStore();

  if (!notificationId) return null;

  const notification = getNotifciationById(notificationId);

  if (!notification) return null;

  return (
    <>
      <div className="navigation-info-subtitle">Notification</div>

      <div className="navigation-info-list">
        <div className="navigation-info-item">
          <div>Name</div>
          <div>{notification.friendlyName}</div>
        </div>

        <div className="navigation-info-item">
          <div>Id</div>
          <div>{notification.id}</div>
        </div>

        <div className="navigation-info-item">
          <div>Platform</div>
          <div>{notification.platform}</div>
        </div>

        <div className="navigation-info-item">
          <div>Format</div>
          <div>{notificationText[notification.messageType]}</div>
        </div>

        <div className="navigation-info-item">
          <div>Type</div>
          <div>{notificationType}</div>
        </div>
      </div>
    </>
  );
});

const NavigationMonitorInfo = ({ monitor }) => {
  if (!monitor) return null;

  return (
    <>
      <div className="navigation-info-title">Monitor Info</div>

      <div className="navigation-info-list">
        <div className="navigation-info-item">
          <div>Name</div>
          <div>{monitor.name}</div>
        </div>

        <div className="navigation-info-item">
          <div>Monitor ID</div>
          <div>{monitor.monitorId}</div>
        </div>

        <div className="navigation-info-item">
          <div>URL</div>
          <div>
            {monitor.type === 'http'
              ? monitor.url
              : `${monitor.url}:${monitor.port}`}
          </div>
        </div>

        {monitor.method ? (
          <div className="navigation-info-item">
            <div>Method</div>
            <div>{monitor.method}</div>
          </div>
        ) : null}

        {monitor.type === 'http' ? (
          <div className="navigation-info-item">
            <div>Valid Status Codes</div>
            <div>{monitor.valid_status_codes?.join(', ') || 'None'}</div>
          </div>
        ) : null}

        <div className="navigation-info-item">
          <div>Creator</div>
          <div>{monitor.email}</div>
        </div>

        <div className="navigation-info-item">
          <div>Paused</div>
          <div>{monitor.paused ? 'True' : 'False'}</div>
        </div>

        <div className="navigation-info-item">
          <div>Created At</div>
          <div>{dayjs(monitor.createdAt).format('DD-MM-YYYY HH:mm:ss')}</div>
        </div>
      </div>

      <div className="navigation-info-subtitle">Intervals</div>

      <div className="navigation-info-list">
        <div className="navigation-info-item">
          <div>Request</div>
          <div>{monitor.interval} seconds</div>
        </div>

        <div className="navigation-info-item">
          <div>Timeout</div>
          <div>{monitor.requestTimeout} seconds</div>
        </div>

        <div className="navigation-info-item">
          <div>Retry</div>
          <div>{monitor.retryInterval} seconds</div>
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
