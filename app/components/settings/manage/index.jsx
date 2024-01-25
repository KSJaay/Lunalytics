import './style.scss';
import { useEffect, useState } from 'react';
import { createGetRequest } from '../../../services/axios';
import MembersTable from './member';

const ManageTeam = () => {
  const [team, setTeam] = useState({ currentUser: {}, members: [] });

  const sortedMembers = team.members?.sort(
    (a, b) => a.permission - b.permission
  );

  const fetchTeam = async () => {
    try {
      const query = await createGetRequest('/api/user/team');

      setTeam(query.data);
    } catch (error) {
      console.log(error);
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
        <MembersTable user={team.currentUser} members={sortedMembers} />
      </div>
    </div>
  );
};

export default ManageTeam;
