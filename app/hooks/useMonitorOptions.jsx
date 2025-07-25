import { useMemo } from 'react';
import { createGetRequest, createPostRequest } from '../services/axios';
import { toast } from 'react-toastify';
import { FaClone, FaPause, FaPlay } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { FaTrashCan } from 'react-icons/fa6';
import MonitorConfigureModal from '../components/modal/monitor/configure';
import MonitorModal from '../components/modal/monitor/delete';

const useMonitorOptions = (
  Container,
  monitor,
  addMonitor,
  editMonitor,
  removeMonitor,
  closeModal,
  openModal
) => {
  const handleConfirm = async () => {
    try {
      await createGetRequest('/api/monitor/delete', {
        monitorId: monitor.monitorId,
      });

      removeMonitor(monitor.monitorId);

      toast.success('Monitor deleted successfully!');

      closeModal();
    } catch (error) {
      closeModal();
      console.log(error);
      toast.error('Error occurred while deleting monitor!');
    }
  };

  const handlePause = async () => {
    try {
      await createPostRequest('/api/monitor/pause', {
        monitorId: monitor.monitorId,
        pause: !monitor.paused,
      });

      editMonitor({ ...monitor, paused: !monitor.paused });

      toast.success(
        monitor.paused
          ? 'Monitor resumed successfully!'
          : 'Monitor paused successfully!'
      );
    } catch (error) {
      console.log(error);
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

  const options = useMemo(() => {
    return [
      {
        id: 'monitor-clone-button',
        text: (
          <Container
            text="Clone"
            icon={FaClone}
            onClick={handleClone}
            key="monitor-clone-button"
            id="monitor-clone-button"
          />
        ),
        type: 'item',
      },
      {
        id: 'monitor-edit-button',
        text: (
          <Container
            text="Edit"
            icon={MdEdit}
            onClick={handleEdit}
            key="monitor-edit-button"
            id="monitor-edit-button"
          />
        ),
        type: 'item',
      },
      {
        id: 'monitor-delete-button',
        text: (
          <Container
            text="Delete"
            icon={FaTrashCan}
            onClick={handleDelete}
            key="monitor-delete-button"
            id="monitor-delete-button"
          />
        ),
        type: 'item',
      },
      {
        id: 'monitor-pause-button',
        text: (
          <Container
            text={monitor?.paused ? 'Resume' : 'Pause'}
            icon={monitor?.paused ? FaPlay : FaPause}
            onClick={handlePause}
            key="monitor-pause-button"
            id="monitor-pause-button"
          />
        ),
        type: 'item',
      },
    ];
  }, [JSON.stringify(monitor)]);

  return { options };
};

export default useMonitorOptions;

// More options for the future

// { id: 'separator-1', type: 'separator' },
// {
//   id: 'folder-move-options',
//   type: 'submenu',
//   text: <Container text="Move to folder" icon={MdFolder} />,
//   options: [
//     {
//       id: 'folder-move-to-folder-1',
//       text: <Container text="Folder 1" icon={MdFolder} />,
//       type: 'item',
//     },
//     {
//       id: 'folder-move-to-folder-2',
//       text: <Container text="Folder 2" icon={MdFolder} />,
//       type: 'item',
//     },
//     {
//       id: 'folder-move-to-folder-3',
//       text: <Container text="Folder 3" icon={MdFolder} />,
//       type: 'item',
//     },
//     { id: 'separator-1', type: 'separator' },
//     {
//       id: 'folder-create-new-folder',
//       text: <Container text="Create Folder" icon={MdFolder} />,
//       type: 'item',
//     },
//   ],
// },
// { id: 'separator-2', type: 'separator' },
// {
//   id: 'delete-folder',
//   text: <Container text="Delete Folder" icon={MdFolderDelete} />,
//   type: 'item',
// },
// {
//   id: 'reorganise-monitors',
//   text: <Container text="Reorganise Monitors" icon={MdSort} />,
//   type: 'item',
// },
