// import type definitions
import type { NotificationProps } from '../../../shared/types/notifications';

// import node modules
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

// import local files
import notificationsIcons from '../../constant/notifications.json';
import useNotificationContext from '../../context/notifications';

const NotificationList = ({
  notifications,
}: {
  notifications: NotificationProps[];
}) => {
  const { activeNotification, setActiveNotification } =
    useNotificationContext();

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
            id={`notification-list-item-${notification.id}`}
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
