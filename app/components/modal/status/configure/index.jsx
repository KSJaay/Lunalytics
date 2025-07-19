import './add.scss';

// import dependencies
import { useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { TbLayoutFilled } from 'react-icons/tb';
import { FaCog, FaPalette, FaRegEye } from 'react-icons/fa';

// import local files
import Modal from '../../../ui/modal';
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
    <Modal.Container closeButton={closeModal}>
      <Modal.Title style={{ textAlign: 'center', fontSize: 'var(--font-xl)' }}>
        Add New Component
        <div
          style={{
            gap: '0.5rem',
            display: 'flex',
            padding: '0.75rem 0 0 0',
            alignItems: 'center',
            borderBottom: '1px solid var(--accent-700)',
          }}
        >
          {menuOptions.map(({ id, Icon }) => {
            const isActive = activePage === id;

            return (
              <div
                key={id}
                style={{
                  borderBottom: isActive
                    ? '4px solid var(--primary-700)'
                    : '4px solid transparent',
                  padding: '0.25rem 1rem 0.5rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
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
      </Modal.Title>
      <Modal.Message style={{ width: '1440px' }}>
        <StatusConfigureContent currentTab={activePage} showActionBar={false} />
      </Modal.Message>

      <Modal.Actions>
        <Modal.Button onClick={closeModal}>Cancel</Modal.Button>
        <Modal.Button
          color="green"
          id="monitor-create-button"
          onClick={handleCreate}
        >
          Create
        </Modal.Button>
      </Modal.Actions>
    </Modal.Container>
  );
};

StatusConfigurCreateModal.displayName = 'StatusConfigurCreateModal';

StatusConfigurCreateModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  createComponent: PropTypes.func.isRequired,
};

export default observer(StatusConfigurCreateModal);
