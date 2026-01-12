// import dependencies
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import { FaTrashCan } from 'react-icons/fa6';
import { IoArrowBack } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

// import local files
import useContextStore from '../../../context';
import { createGetRequest, createPostRequest } from '../../../services/axios';
import NotificationDeleteModal from '../../modal/notification/delete';
import { PermissionsBits } from '../../../../shared/permissions/bitFlags';
import useScreenSize from '../../../hooks/useScreenSize';
import { BsFillSendFill } from 'react-icons/bs';
import useMemberContext from '../../../context/member';

const HomeNotificationHeader = ({
  isMobile = false,
}: {
  isMobile: boolean;
}) => {
  const {
    modalStore: { openModal, closeModal },
    notificationStore: {
      deleteNotification,
      activeNotification: notification,
      setActiveNotification,
    },
  } = useContextStore();

  const { member } = useMemberContext();

  const { t } = useTranslation();

  const screenSize = useScreenSize();
  const isDesktop = screenSize === 'desktop';

  if (!notification) {
    return (
      <div className="navigation-header-content">
        <div className="navigation-header-title">
          <div>Notification</div>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      const { id } = notification;
      await createGetRequest('/api/notifications/delete', {
        notificationId: id,
      });

      deleteNotification(id);
      setActiveNotification(isDesktop ? null : 'mobile-reset');
      closeModal();
      toast.success('Notification deleted successfully!');
    } catch (error) {
      console.log(error);
      closeModal();
      toast.error('Something went wrong! Please try again later.');
    }
  };

  const testNotification = async () => {
    try {
      await createPostRequest('/api/notifications/test', notification);
      toast.success('Test notification sent successfully');
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('Failed to send test notification');
    }
  };

  const isEditor = member?.role.hasPermission(PermissionsBits.MANAGE_MONITORS);

  return (
    <div className="navigation-header-content">
      {isMobile ? (
        <div
          style={{ padding: '0 12px 0 6px' }}
          onClick={() => setActiveNotification('mobile-reset')}
        >
          <IoArrowBack size={24} />
        </div>
      ) : null}
      <div className="navigation-header-title">
        <div>
          {t('common.notification')} -{' '}
          {notification.friendlyName || 'Lunalytics'}
        </div>

        {notification?.platform ? (
          <div className="navigation-header-subtitle">
            {t('notification.notification_for')}{' '}
            <span>{notification.platform}</span>
          </div>
        ) : null}
      </div>
      <div className="navigation-header-buttons">
        {isEditor ? (
          <>
            <div
              onClick={() => testNotification()}
              id="notification-header-test-button"
            >
              <BsFillSendFill />
            </div>
            <div
              id="notification-header-delete-button"
              onClick={() =>
                openModal(
                  <NotificationDeleteModal
                    name={notification.friendlyName}
                    handleClose={closeModal}
                    handleConfirm={handleDelete}
                  />
                )
              }
            >
              <FaTrashCan style={{ width: '20px', height: '20px' }} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default observer(HomeNotificationHeader);
