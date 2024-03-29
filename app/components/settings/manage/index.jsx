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

  const sortedMembers = team?.sort((a, b) => a?.permission - b?.permission);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const query = await createGetRequest('/api/user/team');

        setTeam(query.data);
      } catch (error) {
        toast.error("Couldn't fetch team members");
      }
    };

    fetchTeam();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '10px 20px',
      }}
    >
      <div style={{ display: 'flex' }}>
        <MembersTable members={sortedMembers} />
      </div>
    </div>
  );
};

ManageTeam.displayName = 'ManageTeam';

export default observer(ManageTeam);
