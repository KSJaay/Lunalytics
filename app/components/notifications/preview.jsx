// import dependencies
import { Input, Preview } from '@lunalytics/ui';

// import local files
import { fullMonitorPropType } from '../../../shared/utils/propTypes';
import { observer } from 'mobx-react-lite';
import useContextStore from '../../context';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { filterData } from '../../../shared/utils/search';

const NotificationPreview = ({ children }) => {
  const {
    notificationStore: { allNotifications = [], setActiveNotification },
  } = useContextStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const items = useMemo(() => {
    if (!allNotifications?.length) return [];

    return filterData(allNotifications, search, [
      'friendlyName',
      'platform',
    ]).map((notification) => {
      return (
        <div
          className="navigation-preview-content"
          key={notification.id}
          onClick={() => {
            navigate('/notifications');
            setActiveNotification(notification.id);
          }}
        >
          <div className="navigation-preview-item">
            <div>{notification.friendlyName}</div>
            <div className="navigation-preview-subtitle">
              {notification.platform}
            </div>
          </div>
        </div>
      );
    });
  }, [search, JSON.stringify(allNotifications)]);

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
        !items?.length
          ? [
              input,
              <div
                className="navigation-preview-no-items"
                key="no-notification-preview"
              >
                No notifications found
              </div>,
            ]
          : [input, ...items]
      }
      popupClassName="navigation-preview-container"
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
