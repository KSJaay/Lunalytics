import './avatar.scss';

// import dependencies
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';

// import local files
import Modal from '../../../ui/modal';
import TextInput from '../../../ui/input';
import useTeamContext from '../../../../context/team';
import { createGetRequest } from '../../../../services/axios';
import useDropdown from '../../../../hooks/useDropdown';
import Dropdown from '../../../ui/dropdown';
import { AlertError } from '../../../ui/alert';
import useContextStore from '../../../../context';
import handleTransferAccount from '../../../../handlers/settings/account/transfer';

const SettingsAccountTransferModal = ({ closeModal }) => {
  const { getTeam, setTeam } = useTeamContext();
  const {
    userStore: { user },
  } = useContextStore();
  const { dropdownIsOpen, selectedId, toggleDropdown, handleDropdownSelect } =
    useDropdown();
  const team = getTeam();

  const sortedMembers = team
    ?.sort((a, b) => a?.permission - b?.permission)
    .filter((member) => member.isVerified);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const query = await createGetRequest('/api/user/team');

        const filteredMembers = query.data?.filter(
          (member) => member.email !== user.email
        );

        setTeam(filteredMembers);
      } catch (error) {
        console.log(error);
        toast.error("Couldn't fetch team members");
      }
    };

    fetchTeam();
  }, []);

  const dropdownItems = sortedMembers.map((member) => (
    <Dropdown.Item
      key={member.email}
      onClick={() => {
        handleDropdownSelect(member.email);
        toggleDropdown();
      }}
      showDot
      isSelected={selectedId === member.email}
      dotColor="primary"
    >
      {member.email}
    </Dropdown.Item>
  ));

  return (
    <>
      <Modal.Title style={{ textAlign: 'center' }}>
        Transfer ownership
      </Modal.Title>
      <Modal.Message style={{ width: '400px' }}>
        <AlertError
          title="Warning"
          description="The following action is not reversible. Please be certain before you proceed."
        />

        <div
          style={{
            fontWeight: '500',
            fontSize: '16px',
            color: 'var(--font-color)',
            marginLeft: '5px',
            marginTop: '15px',
          }}
        >
          Select member to transfer ownership
        </div>

        <Dropdown.Container
          position="center"
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
          id="home-menu-layout"
        >
          <Dropdown.Trigger
            isOpen={dropdownIsOpen}
            toggleDropdown={toggleDropdown}
            asInput
          >
            {selectedId || 'Select member'}
          </Dropdown.Trigger>
          <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
            {dropdownItems}
          </Dropdown.List>
        </Dropdown.Container>

        <TextInput
          id="settings-transfer-confirm"
          label={
            <div style={{ fontWeight: '500', fontSize: '14px' }}>
              To verify, type{' '}
              <span style={{ fontWeight: '800' }}>transfer ownership</span>{' '}
              below:
            </div>
          }
        />

        <div
          style={{
            fontWeight: '500',
            fontSize: '15px',
            color: 'var(--red-700)',
            marginTop: '15px',
          }}
        >
          By continuing, you acknowledge that the application will be
          transferred to the selected user.
        </div>
      </Modal.Message>

      <Modal.Actions>
        <Modal.Button color="red" onClick={closeModal}>
          Cancel
        </Modal.Button>
        <Modal.Button
          color="green"
          onClick={() => {
            const transferConfirm = document.getElementById(
              'settings-transfer-confirm'
            ).value;

            if (transferConfirm.toLowerCase().trim() !== 'transfer ownership') {
              return toast.error('Enter transfer ownership to confirm.');
            }

            handleTransferAccount(selectedId, closeModal);
          }}
        >
          Confirm
        </Modal.Button>
      </Modal.Actions>
    </>
  );
};

SettingsAccountTransferModal.displayName = 'SettingsAccountTransferModal';

SettingsAccountTransferModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default observer(SettingsAccountTransferModal);
