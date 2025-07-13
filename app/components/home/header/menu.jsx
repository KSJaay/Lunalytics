// import dependencies
import { toast } from 'react-toastify';
import { MdEdit } from 'react-icons/md';
import { observer } from 'mobx-react-lite';
import { LuEllipsis } from 'react-icons/lu';
import { FaTrashCan } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { FaClone, FaPause, FaPlay } from 'react-icons/fa';

// import local files
import Dropdown from '../../ui/dropdown';
import useDropdown from '../../../hooks/useDropdown';
import useContextStore from '../../../context';
import MonitorModal from '../../modal/monitor/delete';
import MonitorConfigureModal from '../../modal/monitor/configure';
import { createGetRequest, createPostRequest } from '../../../services/axios';

const HomeMonitorHeaderMenu = () => {
  const {
    modalStore: { openModal, closeModal },
    globalStore: {
      addMonitor,
      editMonitor,
      removeMonitor,
      activeMonitor: monitor,
      setActiveMonitor,
    },
  } = useContextStore();

  const { toggleDropdown, dropdownIsOpen } = useDropdown(true);

  const navigate = useNavigate();
  const monitorId = monitor?.monitorId;

  const handleConfirm = async () => {
    await createGetRequest('/api/monitor/delete', {
      monitorId,
    });

    removeMonitor(monitorId);
    setActiveMonitor(null);

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
        monitorId={monitor.monitorId}
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
      value: monitor?.paused ? 'Resume' : 'Pause',
      icon: monitor?.paused ? (
        <FaPlay style={{ width: '20px', height: '20px' }} />
      ) : (
        <FaPause style={{ width: '20px', height: '20px' }} />
      ),
      onClick: handlePause,
      id: 'monitor-clone-button',
    },
  ];

  return (
    <div onClick={toggleDropdown}>
      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
        position="center"
      >
        <Dropdown.Trigger
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
        >
          <LuEllipsis size={20} onClick={toggleDropdown} />
        </Dropdown.Trigger>
        <Dropdown.List isOpen={dropdownIsOpen}>
          {options.map((option) => (
            <Dropdown.Item
              key={option.id}
              id={option.id}
              onClick={option.onClick}
              className="home-header-menu-list-item"
            >
              {option.icon}
              {option.value}
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>
    </div>
  );
};

export default observer(HomeMonitorHeaderMenu);
