// import dependencies
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import { FaTrashCan } from 'react-icons/fa6';

// import local files
import useContextStore from '../../../context';
import Role from '../../../../shared/permissions/role';
import { createGetRequest } from '../../../services/axios';
import NotificationDeleteModal from '../../modal/notification/delete';
import { PermissionsBits } from '../../../../shared/permissions/bitFlags';

const HomeNotificationHeader = () => {
  const {
    userStore: { user },
    modalStore: { openModal, closeModal },
    notificationStore: {
      deleteNotification,
      activeNotification: notification,
      setActiveNotification,
    },
  } = useContextStore();

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

      setActiveNotification(null);
      deleteNotification(id);
      closeModal();
      toast.success('Notification deleted successfully!');
    } catch (error) {
      console.log(error);
      closeModal();
      toast.error('Something went wrong! Please try again later.');
    }
  };

  const role = new Role('user', user.permission);
  const isEditor = role.hasPermission(PermissionsBits.MANAGE_MONITORS);

  return (
    <div className="navigation-header-content">
      <div className="navigation-header-title">
        <div>Notification - {notification.friendlyName || 'Lunalytics'}</div>

        {notification?.platform ? (
          <div className="navigation-header-subtitle">
            Notification for <span>{notification.platform}</span>
          </div>
        ) : null}
      </div>
      <div className="navigation-header-buttons">
        {isEditor ? (
          <div
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
        ) : null}
      </div>
    </div>
  );
};

export default observer(HomeNotificationHeader);
