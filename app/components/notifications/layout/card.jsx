import './card.scss';

// import dependencies
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';

// import local files
import useDropdown from '../../../hooks/useDropdown';
import { FaEllipsisVertical } from '../../icons';
import Button from '../../ui/button';
import Dropdown from '../../ui/dropdown';
import useContextStore from '../../../context';
import NotificationModal from '../../modal/notification';
import NotificationDeleteModal from '../../modal/notification/delete';
import { createGetRequest } from '../../../services/axios';

const NotificationIcons = {
  Discord: '/notifications/discord.svg',
  Slack: '/notifications/slack.svg',
  Telegram: '/notifications/telegram.svg',
  Webhook: '/notifications/webhook.svg',
};

const NotificationCard = ({ notification = {} }) => {
  const {
    modalStore: { openModal, closeModal },
    notificationStore: {
      addNotification,
      deleteNotification,
      toggleNotification,
    },
  } = useContextStore();
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  const handleDelete = async (id) => {
    try {
      await createGetRequest('/api/notifications/delete', {
        notificationId: id,
      });

      deleteNotification(id);
      closeModal();
    } catch (e) {
      console.log(e);
      closeModal();
      toast.error('Something went wrong! Please try again later.');
    }
  };

  const handleToggle = async (id, isEnabled) => {
    try {
      await createGetRequest('/api/notifications/toggle', {
        notificationId: id,
        isEnabled,
      });

      toggleNotification(id, isEnabled);
      toggleDropdown();
    } catch (e) {
      console.log(e);
      closeModal();
      toast.error('Something went wrong! Please try again later.');
    }
  };

  return (
    <div className="notification-card-container">
      <img
        src={NotificationIcons[notification.platform]}
        alt="discord"
        className={`notification-card-img ${
          notification.isEnabled ? '' : 'notification-card-img-disabled'
        }`}
      />

      <div className="notification-card-title">
        {notification.friendlyName || notification.platform}
      </div>

      <Button
        fullWidth
        outline="primary"
        onClick={() =>
          openModal(
            <NotificationModal
              values={{ ...notification, ...notification.data }}
              isEdit
              closeModal={closeModal}
              addNotification={addNotification}
            />
          )
        }
      >
        Configure
      </Button>

      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
        position="center"
        className="notification-card-dropdown"
      >
        <Dropdown.Trigger
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
        >
          <div className="notification-card-dropdown-trigger">
            <FaEllipsisVertical style={{ width: '20px', height: '20px' }} />
          </div>
        </Dropdown.Trigger>
        <Dropdown.List isOpen={dropdownIsOpen}>
          <Dropdown.Item
            onClick={() => {
              handleToggle(notification.id, !notification.isEnabled);
            }}
          >
            {notification.isEnabled ? 'Disable' : 'Enable'}
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() =>
              openModal(
                <NotificationModal
                  values={{ ...notification, ...notification.data }}
                  isEdit
                  closeModal={closeModal}
                  addNotification={addNotification}
                />
              )
            }
          >
            Edit
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              openModal(
                <NotificationDeleteModal
                  name={notification.friendlyName}
                  handleClose={closeModal}
                  handleConfirm={() => handleDelete(notification.id)}
                />
              );
            }}
          >
            Delete
          </Dropdown.Item>
        </Dropdown.List>
      </Dropdown.Container>
    </div>
  );
};

NotificationCard.displayName = 'NotificationCard';

NotificationCard.propTypes = {
  notification: PropTypes.object,
};

export default observer(NotificationCard);
