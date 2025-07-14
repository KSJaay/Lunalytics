// import dependencies
import { observer } from 'mobx-react-lite';
import { ContextMenu } from '@lunalytics/ui';

// import local files
import { FaClone, FaTrashCan } from 'react-icons/fa6';
import { MdEdit, MdFolder, MdFolderDelete, MdSort } from 'react-icons/md';
import { FaPlay } from 'react-icons/fa';

const HomeMonitorsListContext = ({ children, monitorId }) => {
  const styles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const itemOptions = [
    {
      id: 'monitor-clone-button',
      text: (
        <div style={styles}>
          <FaClone size={16} />
          <div>Clone</div>
        </div>
      ),
      type: 'item',
    },
    {
      id: 'monitor-edit-button',
      text: (
        <div style={styles}>
          <MdEdit size={16} />
          <div>Edit</div>
        </div>
      ),
      type: 'item',
    },
    {
      id: 'monitor-delete-button',
      text: (
        <div style={styles}>
          <FaTrashCan size={16} />
          <div>Delete</div>
        </div>
      ),
      type: 'item',
    },
    {
      id: 'monitor-pause-button',
      text: (
        <div style={styles}>
          <FaPlay size={16} />
          <div>Pause</div>
        </div>
      ),
      type: 'item',
    },
    { id: 'separator-1', type: 'separator' },
    {
      id: 'folder-move-options',
      type: 'submenu',
      text: (
        <div style={styles}>
          <MdFolder size={16} />
          <div>Move to folder</div>
        </div>
      ),
      options: [
        {
          id: 'folder-move-to-folder-1',
          text: (
            <div style={styles}>
              <MdFolder size={16} />
              <div>Folder 1</div>
            </div>
          ),
          type: 'item',
        },
        {
          id: 'folder-move-to-folder-2',
          text: (
            <div style={styles}>
              <MdFolder size={16} />
              <div>Folder 2</div>
            </div>
          ),
          type: 'item',
        },
        {
          id: 'folder-move-to-folder-3',
          text: (
            <div style={styles}>
              <MdFolder size={16} />
              <div>Folder 3</div>
            </div>
          ),
          type: 'item',
        },
        { id: 'separator-1', type: 'separator' },
        {
          id: 'folder-create-new-folder',
          text: (
            <div style={styles}>
              <MdFolder size={16} />
              <div>Create Folder</div>
            </div>
          ),
          type: 'item',
        },
      ],
    },
    { id: 'separator-2', type: 'separator' },
    {
      id: 'delete-folder',
      text: (
        <div style={styles}>
          <MdFolderDelete size={16} />
          <div>Delete Folder</div>
        </div>
      ),
      type: 'item',
    },
    {
      id: 'reorganise-monitors',
      text: (
        <div style={styles}>
          <MdSort size={16} />
          <div>Reorganise Monitors</div>
        </div>
      ),
      type: 'item',
    },
  ];

  return (
    <ContextMenu
      position="bottom"
      key={monitorId}
      items={itemOptions}
      align="start"
    >
      {children}
    </ContextMenu>
  );
};

export default observer(HomeMonitorsListContext);
