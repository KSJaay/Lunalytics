// import styles
import '../styles/pages/notifications.scss';

// import dependencies
import { Button } from '@lunalytics/ui';
import { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';

// import local files
import useContextStore from '../context';
import Navigation from '../components/navigation';
import NotificationList from '../components/notifications/list';
import NotificationModal from '../components/modal/notification';
import NotificationContent from '../components/notifications/content';
import HomeNotificationHeader from '../components/notifications/header';

const Notifications = () => {
  const {
    modalStore: { openModal, closeModal },
    notificationStore: {
      allNotifications,
      addNotification,
      activeNotification,
      setActiveNotification,
    },
  } = useContextStore();

  const [search, setSearch] = useState(null);

  useEffect(() => {
    if (!activeNotification && allNotifications[0]) {
      setActiveNotification(allNotifications[0]);
    }
  }, [allNotifications, activeNotification, setActiveNotification]);

  const handleSearchUpdate = (search = '') => {
    setSearch(search.trim());
  };

  const notifications = useMemo(
    () =>
      allNotifications.filter((notification) => {
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
    [search, allNotifications]
  );

  return (
    <Navigation
      activeUrl="/notifications"
      handleSearchUpdate={handleSearchUpdate}
      leftChildren={<NotificationList notifications={notifications} />}
      leftButton={
        <Button
          variant="flat"
          fullWidth
          onClick={() =>
            openModal(
              <NotificationModal
                closeModal={closeModal}
                addNotification={addNotification}
              />,
              false
            )
          }
        >
          Add Notification
        </Button>
      }
      header={{
        HeaderComponent: HomeNotificationHeader,
      }}
    >
      {!activeNotification ? (
        <div
          style={{
            height: '100%',
            width: '100%',
            fontWeight: 'bold',
            fontSize: 'var(--font-2xl)',
            color: 'var(--font-light-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          No notifications found
        </div>
      ) : (
        <NotificationContent />
      )}
    </Navigation>
  );
};

Notifications.displayName = 'Notifications';

Notifications.propTypes = {};

export default observer(Notifications);
