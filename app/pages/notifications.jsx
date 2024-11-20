// import styles
import '../styles/pages/notifications.scss';

// import dependencies
import { observer } from 'mobx-react-lite';

// import local files
import useContextStore from '../context';
import NotificationsMenu from '../components/notifications/menu';
import NotificationCard from '../components/notifications/layout/card';
import { useMemo, useState } from 'react';
import { MdNotifications } from '../components/icons';

const Notifications = () => {
  const {
    notificationStore: { allNotifications },
  } = useContextStore();

  const [search, setSearch] = useState(null);
  const [platform, setPlatform] = useState('All');

  const handlePlatformUpdate = (platform) => {
    setPlatform(platform);
  };

  const handleSearchUpdate = (search = '') => {
    setSearch(search.trim());
  };

  const notifications = useMemo(
    () =>
      allNotifications.filter((notification) => {
        if (platform !== 'All' && notification.platform !== platform) {
          return false;
        }

        if (search) {
          return (
            notification.friendlyName
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            notification.platform.toLowerCase().includes(search.toLowerCase())
          );
        }
        return true;
      }),
    [platform, search, allNotifications]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <NotificationsMenu
        search={search}
        setSearch={handleSearchUpdate}
        platform={platform}
        setPlatform={handlePlatformUpdate}
      />

      {notifications.length === 0 && (
        <div className="notification-empty">
          <div className="notification-empty-icon">
            <MdNotifications style={{ width: '64px', height: '64px' }} />
          </div>
          <div className="notification-empty-text">No notifications found</div>
        </div>
      )}

      <div className="notification-container">
        {notifications.length > 0 &&
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
      </div>
    </div>
  );
};

Notifications.displayName = 'Notifications';

Notifications.propTypes = {};

export default observer(Notifications);
