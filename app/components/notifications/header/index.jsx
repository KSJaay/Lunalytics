// import dependencies
import { observer } from 'mobx-react-lite';
import { LuInfo } from 'react-icons/lu';

// import local files
import useContextStore from '../../../context';
import Role from '../../../../shared/permissions/role';
import { PermissionsBits } from '../../../../shared/permissions/bitFlags';
import NotificationDeleteModal from '../../modal/notification/delete';
import { FaTrashCan } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { createGetRequest } from '../../../services/axios';

const HomeNotificationHeader = ({
  notification,
  isInfoOpen,
  setIsInfoOpen,
  rightChildren,
  setActiveNotification,
}) => {
  const {
    userStore: { user },
    modalStore: { openModal, closeModal },
    notificationStore: { deleteNotification },
  } = useContextStore();

  const handleDelete = async () => {
    const { id } = notification;
    try {
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
        <div>
          Notification {'>'} {notification?.friendlyName}
        </div>

        <div className="navigation-header-subtitle">
          Notification for <span>{notification.platform}</span>
        </div>
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
        {rightChildren ? (
          <div onClick={() => setIsInfoOpen(!isInfoOpen)}>
            <LuInfo size={20} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default observer(HomeNotificationHeader);
