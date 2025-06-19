import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';

import Modal from '../../../ui/modal';
import useContextStore from '../../../../context';
import useTokensContext from '../../../../context/tokens';
import { createPostRequest } from '../../../../services/axios';

const SettingsApiCloseModal = ({ tokenId = '', tokenName = '' }) => {
  const { removeToken } = useTokensContext();
  const {
    modalStore: { closeModal },
  } = useContextStore();

  const handleDelete = async () => {
    try {
      await createPostRequest(`/api/tokens/delete`, { token: tokenId });

      removeToken(tokenId);

      closeModal();
    } catch (error) {
      if (error.response.status === 401) {
        closeModal();
        return;
      }

      toast.error('Error occured while deleting token');
    }
  };

  return (
    <Modal.Container>
      <Modal.Title>Delete API Token</Modal.Title>
      <Modal.Message>
        Are you sure you want to delete <b>{tokenName}</b> token?
        <br />
        This is an irreversible action.
      </Modal.Message>
      <Modal.Actions>
        <Modal.Button id="manage-close-button" onClick={closeModal}>
          Close
        </Modal.Button>
        <Modal.Button
          id="manage-create-button"
          color="green"
          onClick={handleDelete}
        >
          Delete
        </Modal.Button>
      </Modal.Actions>
    </Modal.Container>
  );
};

SettingsApiCloseModal.displayName = 'SettingsApiCloseModal';

export default observer(SettingsApiCloseModal);
