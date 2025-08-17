import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';

import useContextStore from '../../../../context';
import useTokensContext from '../../../../context/tokens';
import { createPostRequest } from '../../../../services/axios';
import { Button, Modal } from '@lunalytics/ui';

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
    <Modal
      title="Delete API Token"
      actions={
        <>
          <Button
            color="red"
            variant="flat"
            id="manage-close-button"
            onClick={closeModal}
          >
            Close
          </Button>
          <Button
            color="green"
            variant="flat"
            id="manage-create-button"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </>
      }
      onClose={closeModal}
      size="xs"
    >
      Are you sure you want to delete <b>{tokenName}</b> token?
      <br />
      This is an irreversible action.
    </Modal>
  );
};

SettingsApiCloseModal.displayName = 'SettingsApiCloseModal';

export default observer(SettingsApiCloseModal);
