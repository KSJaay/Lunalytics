import classNames from 'classnames';

const NotificationIcons = {
  Discord: '/notifications/discord.svg',
  Slack: '/notifications/slack.svg',
  Telegram: '/notifications/telegram.svg',
  Webhook: '/notifications/webhook.svg',
  HomeAssistant: '/notifications/homeAssistant.svg',
};

const NotificationList = ({
  notifications,
  activeNotification,
  setActiveNotification,
}) => {
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
            onClick={() => setActiveNotification(notification)}
          >
            <div className="icon-container">
              <img
                src={NotificationIcons[notification.platform]}
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

export default NotificationList;
