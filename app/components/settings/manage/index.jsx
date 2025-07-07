// import dependencies
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';

// import local files
import MembersTable from './member';
import useTeamContext from '../../../context/team';
import useFetch from '../../../hooks/useFetch';

const ManageTeam = () => {
  const { teamMembers, setTeam } = useTeamContext();

  const sortedMembers = teamMembers
    ?.sort((a, b) => a?.permission - b?.permission)
    .sort((a, b) => b?.isVerified - a?.isVerified);

  const { isLoading } = useFetch({
    url: '/api/user/team',
    onSuccess: (data) => setTeam(data),
    onFailure: () => toast.error("Couldn't fetch team members"),
  });

  if (!isLoading) return null;

  return (
    <div
      style={{
        overflow: 'auto',
      }}
      className="settings-account-container"
      id="manage"
    >
      <MembersTable members={sortedMembers} />
    </div>
  );
};

ManageTeam.displayName = 'ManageTeam';

export default observer(ManageTeam);
