// import dependencies
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Button, Tooltip } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';
import { MdGroupAdd } from 'react-icons/md';

// import local files
import useFetch from '../../../hooks/useFetch';
import useContextStore from '../../../context';
import CreateInviteModal from '../../modal/settings/invite';
import useInvitesContext from '../../../context/invites';
import useClipboard from '../../../hooks/useClipboard';
import useCurrentUrl from '../../../hooks/useCurrentUrl';
import { FaTrashCan } from 'react-icons/fa6';
import { FaPlay } from 'react-icons/fa';

const ManageInvites = () => {
  const { allInvites, setInvites } = useInvitesContext();
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

  return (
    <div
      style={{ overflow: 'auto', overflowX: 'hidden' }}
      className="settings-account-container"
      id="invite"
    >
      <div className="sat-header">
        <div style={{ flex: 1 }}>
          <div className="settings-subtitle" style={{ margin: '0px' }}>
            Invites
          </div>
          <div className="sat-subheader">
            Invites can be used to invite users to Lunalytics.
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
                  style={{ display: 'flex', alignItems: 'center' }}
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
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {invite.limit ? `${invite.uses}/${invite.limit}` : invite.uses}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {invite.expiresAt
                  ? dayjs(invite.expiresAt).format('lll')
                  : 'Never'}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'var(--accent-900)',
                    padding: '10px',
                    borderRadius: '8px',
                  }}
                  onClick={() => {
                    console.log('Paused invite:', invite);
                  }}
                >
                  <FaTrashCan size={18} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'var(--accent-900)',
                    padding: '10px',
                    borderRadius: '8px',
                  }}
                  onClick={() => {
                    console.log('Paused invite:', invite);
                  }}
                >
                  <FaPlay size={18} />
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
