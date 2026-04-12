// import dependencies
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import { Button } from '@lunalytics/ui';

// import local files
import MembersTable from './member';
import useFetch from '../../../hooks/useFetch';
import useTeamContext from '../../../context/team';
import CreateInviteModal from '../../modal/settings/invite';
import { MemberPermissionBits } from '../../../../shared/permissions/bitFlags';
import useUserContext from '../../../context/user';
import useModalContext from '../../../context/modal';

const ManageTeam = () => {
  const { openModal, closeModal } = useModalContext();
  const { teamMembers, setTeam } = useTeamContext();
  const { hasPermission } = useUserContext();

  const sortedMembers = teamMembers
    ?.sort((a, b) => a?.permission - b?.permission)
    .sort((a, b) => +b?.isVerified - +a?.isVerified);

  const { isLoading } = useFetch({
    url: '/api/workspace/members',
    onSuccess: (data) => setTeam(data),
    onFailure: () => toast.error("Couldn't fetch team members"),
  });

  if (isLoading) {
    return (
      <div
        style={{ overflow: 'auto' }}
        className="settings-account-container"
        id="manage"
      />
    );
  }

  return (
    <div
      style={{ overflowY: 'auto', overflowX: 'hidden' }}
      className="settings-account-container"
      id="manage"
    >
      {/* <div className="sat-header">
        <div style={{ flex: 1 }}>
          <div className="settings-subtitle" style={{ margin: '0px' }}>
            Manage Team
          </div>
          <div className="sat-subheader">
            Manage your team members and their permissions.
          </div>
        </div>
        {hasPermission(MemberPermissionBits.CREATE_INVITE) ? (
          <div className="sat-create-btn">
            <Button
              variant="flat"
              color="primary"
              onClick={() =>
                openModal(<CreateInviteModal closeModal={closeModal} />)
              }
            >
              Invite Member
            </Button>
          </div>
        ) : null}
      </div> */}

      {hasPermission(MemberPermissionBits.CREATE_INVITE) ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '15px',
          }}
        >
          <Button
            variant="flat"
            color="primary"
            onClick={() =>
              openModal(<CreateInviteModal closeModal={closeModal} />)
            }
          >
            Invite Member
          </Button>
        </div>
      ) : null}

      <MembersTable members={sortedMembers} />
    </div>
  );
};

ManageTeam.displayName = 'ManageTeam';

export default observer(ManageTeam);
