import './menu.scss';

// import dependencies
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Button } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

// import local files
import useContextStore from '../../context';
import MonitorModal from '../modal/monitor/delete';
import { createGetRequest, createPostRequest } from '../../services/axios';
import MonitorConfigureModal from '../modal/monitor/configure';
import { FaClone, FaEllipsisVertical, FaTrashCan, MdEdit } from '../icons';
import { FaPlay, FaPause } from '../icons';
import Dropdown from '../ui/dropdown';
import useDropdown from '../../hooks/useDropdown';
import Role from '../../../shared/permissions/role';
import { PermissionsBits } from '../../../shared/permissions/bitFlags';

const MonitorMenu = ({ name = 'Unknown', type, url, monitorId }) => {
  const {
    modalStore: { openModal, closeModal },
    globalStore: { addMonitor, getMonitor, editMonitor, removeMonitor },
    userStore: { user },
  } = useContextStore();
  const { toggleDropdown, dropdownIsOpen } = useDropdown();
  const navigate = useNavigate();

  const monitor = getMonitor(monitorId);
  const role = new Role('user', user.permission);
  const isEditor = role.hasPermission(PermissionsBits.MANAGE_MONITORS);

  const handleConfirm = async () => {
    await createGetRequest('/api/monitor/delete', {
      monitorId,
    });

    removeMonitor(monitorId);

    toast.success('Monitor deleted successfully!');

    closeModal();
    navigate('/home');
  };

  const handlePause = async () => {
    try {
      await createPostRequest('/api/monitor/pause', {
        monitorId,
        pause: !monitor.paused,
      });

      editMonitor({ ...monitor, paused: !monitor.paused });

      toast.success(
        monitor.paused
          ? 'Monitor resumed successfully!'
          : 'Monitor paused successfully!'
      );
    } catch {
      toast.error('Error occurred while pausing monitor!');
    }
  };

  const handleClone = () => {
    openModal(
      <MonitorConfigureModal
        monitor={monitor}
        closeModal={closeModal}
        handleMonitorSubmit={addMonitor}
      />,
      false
    );
  };

  const handleEdit = () => {
    openModal(
      <MonitorConfigureModal
        monitor={monitor}
        closeModal={closeModal}
        handleMonitorSubmit={editMonitor}
        isEdit
      />,
      false
    );
  };

  const handleDelete = () => {
    openModal(
      <MonitorModal
        monitorId={name}
        handleConfirm={handleConfirm}
        handleClose={closeModal}
      />
    );
  };

  const options = [
    {
      value: 'Clone',
      icon: <FaClone style={{ width: '20px', height: '20px' }} />,
      onClick: handleClone,
      id: 'monitor-pause-button',
    },
    {
      value: 'Edit',
      icon: <MdEdit style={{ width: '20px', height: '20px' }} />,
      onClick: handleEdit,
      id: 'monitor-edit-button',
    },
    {
      value: 'Delete',
      icon: <FaTrashCan style={{ width: '20px', height: '20px' }} />,
      onClick: handleDelete,
      id: 'monitor-delete-button',
    },
    {
      value: monitor.paused ? 'Resume' : 'Pause',
      icon: monitor.paused ? (
        <FaPlay style={{ width: '20px', height: '20px' }} />
      ) : (
        <FaPause style={{ width: '20px', height: '20px' }} />
      ),
      onClick: handlePause,
      id: 'monitor-clone-button',
    },
  ];

  return (
    <div className="monitor-view-menu-container">
      <div className="monitor-view-menu-name" id="monitor-view-menu">
        <div id="monitor-view-menu-name">{name}</div>
        <div className="subtitle">
          <span>{type === 'http' ? 'HTTP/S ' : 'TCP '}</span>
          monitor for{' '}
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        </div>
      </div>
      {isEditor && (
        <div className="monitor-view-menu-content">
          {options.map((option) => (
            <Button
              key={option.value}
              id={option.id}
              iconLeft={option.icon}
              onClick={option.onClick}
            >
              {option.value}
            </Button>
          ))}

          <Dropdown.Container
            toggleDropdown={toggleDropdown}
            isOpen={dropdownIsOpen}
            position="left"
          >
            <Dropdown.Trigger
              toggleDropdown={toggleDropdown}
              isOpen={dropdownIsOpen}
            >
              <FaEllipsisVertical style={{ width: '25px', height: '25px' }} />
            </Dropdown.Trigger>
            <Dropdown.List isOpen={dropdownIsOpen}>
              {options.map((option) => (
                <Dropdown.Item key={option.value} onClick={option.onClick}>
                  {option.icon}
                  {option.value}
                </Dropdown.Item>
              ))}
            </Dropdown.List>
          </Dropdown.Container>
        </div>
      )}
    </div>
  );
};

MonitorMenu.displayName = 'MonitorMenu';

MonitorMenu.propTypes = {
  monitorId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default observer(MonitorMenu);
