// import dependencies
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { FaPause, FaPlay } from 'react-icons/fa';
import { observer } from 'mobx-react-lite';
import { MdGroupAdd } from 'react-icons/md';
import { FaTrashCan } from 'react-icons/fa6';
import { Button, Tooltip } from '@lunalytics/ui';

// import local files
import useFetch from '../../../hooks/useFetch';
import useContextStore from '../../../context';
import useClipboard from '../../../hooks/useClipboard';
import useInvitesContext from '../../../context/invites';
import useCurrentUrl from '../../../hooks/useCurrentUrl';
import CreateInviteModal from '../../modal/settings/invite';
import { createPostRequest } from '../../../services/axios';

const ManageInvites = () => {
  const { allInvites, setInvites, removeInvite, pauseInvite } =
    useInvitesContext();
  const {
    modalStore: { openModal, closeModal },
  } = useContextStore();
  const clipboard = useClipboard();
  const currentUrl = useCurrentUrl();

  useFetch({
    url: '/api/invite/all',
    onSuccess: (data) => {
      setInvites(data?.invites || []);
    },
    onFailure: () => toast.error("Couldn't fetch api tokens"),
  });

  const handleDelete = async (id) => {
    try {
      await createPostRequest('/api/invite/delete', { id });
      removeInvite(id);
      toast.success('Invite deleted successfully');
    } catch {
      toast.error('Failed to delete invite');
    }
  };

  const handlePause = async (id, paused) => {
    try {
      await createPostRequest('/api/invite/pause', { id, paused: !paused });
      pauseInvite(id, !paused);
      toast.success('Invite paused successfully');
    } catch {
      toast.error('Failed to pause invite');
    }
  };

  return (
    <div
      style={{ overflowY: 'auto', overflowX: 'hidden' }}
      className="settings-account-container"
      id="invite"
    >
      <div className="sat-header">
        <div style={{ flex: 1 }}>
          <div className="settings-subtitle" style={{ margin: '0px' }}>
            Invites
          </div>
          <div className="sat-subheader">
            Invites codes can be used to invite users to Lunalytics.
          </div>
        </div>
        <div className="sat-create-btn">
          <Button
            variant="flat"
            color="primary"
            onClick={() =>
              openModal(<CreateInviteModal closeModal={closeModal} />)
            }
          >
            Create Invite
          </Button>
        </div>
      </div>

      {!allInvites?.length ? (
        <div className="notification-empty">
          <div className="notification-empty-icon">
            <MdGroupAdd style={{ width: '64px', height: '64px' }} />
          </div>
          <div className="notification-empty-text">No invites found</div>
        </div>
      ) : (
        <>
          <div className="settings-manage-invites-header">
            <div>Invite code</div>
            <div>Uses</div>
            <div>Expires</div>
          </div>

          {allInvites.map((invite) => (
            <div className="settings-manage-invites-item" key={invite.token}>
              <Tooltip text={'Copy invite code'}>
                <div
                  className="settings-invites-item-title"
                  onClick={() =>
                    clipboard(
                      `${currentUrl}/register/?invite=${invite.token}`,
                      'Invite code has been copied to clipboard!'
                    )
                  }
                >
                  {invite.token}
                </div>
              </Tooltip>
              <div className="settings-invites-item-subtitle">
                {invite.limit ? `${invite.uses}/${invite.limit}` : invite.uses}
              </div>
              <div className="settings-invites-item-subtitle">
                {invite.expiresAt
                  ? dayjs(invite.expiresAt).format('lll')
                  : 'Never'}
              </div>
              <div className="settings-invites-buttons-container">
                <div
                  className="settings-invites-button"
                  onClick={() => handlePause(invite.token, invite.paused)}
                >
                  {invite.paused ? <FaPlay size={18} /> : <FaPause size={18} />}
                </div>
                <div
                  className="settings-invites-button"
                  onClick={() => handleDelete(invite.token)}
                >
                  <FaTrashCan size={18} />
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

ManageInvites.displayName = 'ManageInvites';

export default observer(ManageInvites);
