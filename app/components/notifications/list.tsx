import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import useContextStore from '../../context';
import type { NotificationProps } from '../../../shared/types/notifications';
import notificationsIcons from '../../constant/notifications.json';

const NotificationList = ({
  notifications,
}: {
  notifications: NotificationProps[];
}) => {
  const {
    notificationStore: { activeNotification, setActiveNotification },
  } = useContextStore();

  if (!notifications || !notifications?.length) {
    return <div style={{ flex: 1 }}></div>;
  }

  return (
    <div className="navigation-notification-items">
      {notifications.map((notification) => {
        const classes = classNames('item', {
          active: notification.id === activeNotification?.id,
        });

        return (
          <div
            key={notification.id}
            className={classes}
            onClick={() => setActiveNotification(notification.id)}
          >
            <div className="icon-container">
              <img
                src={`/notifications/${
                  notificationsIcons[notification.platform]?.icon
                }`}
                style={{ width: '40px', height: '40px' }}
              />
            </div>
            <div className="content">
              <div>{notification.friendlyName || notification.platform}</div>
              <div className="platform">{notification.platform}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default observer(NotificationList);
