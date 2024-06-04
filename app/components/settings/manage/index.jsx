import './style.scss';

// import dependencies
import { useEffect } from 'react';
import { toast } from 'sonner';

// import local files
import { createGetRequest } from '../../../services/axios';
import MembersTable from './member';
import useTeamContext from '../../../context/team';
import { observer } from 'mobx-react-lite';

const ManageTeam = () => {
  const { getTeam, setTeam } = useTeamContext();
  const team = getTeam();

  const sortedMembers = team
    ?.sort((a, b) => a?.permission - b?.permission)
    .sort((a, b) => b?.isVerified - a?.isVerified);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const query = await createGetRequest('/api/user/team');

        setTeam(query.data);
      } catch (error) {
        console.log(error);
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
