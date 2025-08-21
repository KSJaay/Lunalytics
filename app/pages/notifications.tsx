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
import { filterData } from '../../shared/utils/search';
import { useTranslation } from 'react-i18next';
import useScreenSize from '../hooks/useScreenSize';

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
  const { t } = useTranslation();

  const [search, setSearch] = useState(null);
  const screenSize = useScreenSize();

  const isDesktop = useMemo(() => screenSize === 'desktop', [screenSize]);

  useEffect(() => {
    if (!activeNotification && isDesktop) {
      setActiveNotification(allNotifications[0]?.id);
    }
  }, [allNotifications, activeNotification, setActiveNotification, isDesktop]);

  const handleSearchUpdate = (search = '') => {
    setSearch(search.trim());
  };

  const notifications = useMemo(() => {
    if (!search) return allNotifications;

    return filterData(allNotifications, search, ['friendlyName', 'platform']);
  }, [search, allNotifications]);

  if (!isDesktop && activeNotification) {
    return (
      <div className="monitor-mobile-container">
        <HomeNotificationHeader isMobile={!isDesktop} />
        <NotificationContent />
      </div>
    );
  }

  const content = isDesktop ? <NotificationContent /> : null;

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
              />
            )
          }
        >
          {t('notification.add')}
        </Button>
      }
      header={{ HeaderComponent: HomeNotificationHeader }}
    >
      {!activeNotification ? (
        <div className="monitor-none-exist">{t('notification.none_exist')}</div>
      ) : (
        content
      )}
    </Navigation>
  );
};

Notifications.displayName = 'Notifications';

Notifications.propTypes = {};

export default observer(Notifications);
