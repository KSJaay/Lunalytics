import './add.scss';

// import dependencies
import { useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { Button, Modal } from '@lunalytics/ui';
import { TbLayoutFilled } from 'react-icons/tb';
import { FaCog, FaPalette, FaRegEye } from 'react-icons/fa';

// import local files
import StatusConfigureContent from '../../../status/content';
import handleCreateOrEditStatusPage from '../../../../handlers/status/configure/create';
import useContextStore from '../../../../context';
import useStatusPageContext from '../../../../context/status-page';

const menuOptions = [
  { id: 'Appearance', Icon: FaPalette },
  { id: 'Settings', Icon: FaCog },
  { id: 'Layout', Icon: TbLayoutFilled },
  { id: 'Preview', Icon: FaRegEye },
];

const StatusConfigurCreateModal = ({ closeModal }) => {
  const [activePage, setActivePage] = useState('Appearance');
  const {
    statusStore: { addStatusPage },
  } = useContextStore();

  const { settings, layoutItems } = useStatusPageContext;

  const handleCreate = async () => {
    const hasUpdated = await handleCreateOrEditStatusPage(
      settings,
      layoutItems,
      addStatusPage,
      false
    );

    if (hasUpdated) {
      closeModal();
    }
  };

  return (
    <Modal
      title="Add New Component"
      actions={
        <>
          <Button color="red" variant="flat" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            color="green"
            variant="flat"
            id="monitor-create-button"
            onClick={handleCreate}
          >
            Create
          </Button>
        </>
      }
      size="xl"
      height="xl"
    >
      <div className="smc-options">
        {menuOptions.map(({ id, Icon }) => {
          const isActive = activePage === id;

          return (
            <div
              key={id}
              style={{
                borderBottom: isActive
                  ? '4px solid var(--primary-700)'
                  : '4px solid transparent',
              }}
              className="smc-options-item"
              onClick={() => setActivePage(id)}
            >
              <div style={{ width: '20px', height: '20px' }}>
                <Icon style={{ width: '20px', height: '20px' }} />
              </div>
              <div>{id}</div>
            </div>
          );
        })}
      </div>
      <StatusConfigureContent currentTab={activePage} showActionBar={false} />
    </Modal>
  );
};

StatusConfigurCreateModal.displayName = 'StatusConfigurCreateModal';

StatusConfigurCreateModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  createComponent: PropTypes.func.isRequired,
};

export default observer(StatusConfigurCreateModal);
