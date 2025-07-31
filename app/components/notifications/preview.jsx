// import dependencies
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const items = useMemo(() => {
    if (!allNotifications?.length) return [];

    return filterData(allNotifications, search, [
      'friendlyName',
      'platform',
    ]).map((notification) => {
      const handleOnClick = () => {
        navigate('/notifications');
        setActiveNotification(notification.id);
      };

      return (
        <div
          className="navigation-preview-content"
          key={notification.id}
          onClick={handleOnClick}
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
      placeholder={t('notification.search')}
      key="search"
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
                {t('notification.none_exist')}
              </div>,
            ]
          : [input].concat(items)
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
