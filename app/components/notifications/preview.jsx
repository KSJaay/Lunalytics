import './preview.scss';

// import dependencies
import { Input, Preview } from '@lunalytics/ui';

// import local files
import { fullMonitorPropType } from '../../../shared/utils/propTypes';
import { observer } from 'mobx-react-lite';
import useContextStore from '../../context';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationPreview = ({ children }) => {
  const {
    notificationStore: { allNotifications = [], setActiveNotification },
  } = useContextStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const items = useMemo(() => {
    if (!allNotifications?.length) return [];

    return allNotifications
      .filter((notification) => {
        if (search) {
          return (
            notification.friendlyName
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            notification.platform.toLowerCase().includes(search.toLowerCase())
          );
        }
        return true;
      })
      .map((notification) => {
        return (
          <div
            className="notification-preview-content"
            key={notification.id}
            onClick={() => {
              navigate('/notifications');
              setActiveNotification(notification.id);
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>{notification.friendlyName}</div>
              <div
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--font-light-color)',
                }}
              >
                {notification.platform}
              </div>
            </div>
          </div>
        );
      });
  }, [search, JSON.stringify(allNotifications)]);

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
                key="no-notification-preview"
              >
                No notifications found
              </div>,
            ]
      }
      popupClassName="notification-preview-container"
    >
      {children}
    </Preview>
  );
};

NotificationPreview.displayName = 'NotificationPreview';

NotificationPreview.propTypes = {
  monitor: fullMonitorPropType.isRequired,
};

export default observer(NotificationPreview);
