import './style.scss';

// import dependencies
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// import local files
import { createGetRequest } from '../../../services/axios';
import MembersTable from './member';

const ManageTeam = () => {
  const [team, setTeam] = useState([]);

  const sortedMembers = team?.sort((a, b) => a?.permission - b?.permission);

  const fetchTeam = async () => {
    try {
      const query = await createGetRequest('/api/user/team');

      setTeam(query.data);
    } catch (error) {
      toast.error("Couldn't fetch team members");
    }
  };

  useEffect(() => {
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

export default ManageTeam;
