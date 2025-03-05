import './style.scss';

// import dependencies
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';

// import local files
import { createGetRequest } from '../../../services/axios';
import MembersTable from './member';
import useTeamContext from '../../../context/team';

const ManageTeam = () => {
  const { teamMembers, setTeam } = useTeamContext();

  const sortedMembers = teamMembers
    ?.sort((a, b) => a?.permission - b?.permission)
    .sort((a, b) => b?.isVerified - a?.isVerified);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const query = await createGetRequest('/api/user/team');

        setTeam(query.data);
      } catch (_error) {
        toast.error("Couldn't fetch team members");
      }
    };

    fetchTeam();
  }, []);

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
