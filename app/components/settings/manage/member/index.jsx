// Name
// Email/username
// Permissions
// Approve/decline user
//
import './style.scss';

import MemberTableRow from './row';

const MembersTable = ({ user = {}, members = [] }) => {
  const membersList = members.map((member, index) => (
    <MemberTableRow key={index} currentUser={user} member={member} />
  ));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div className="members-table-header">
        <div className="members-table-header-item">Name</div>
        <div className="members-table-header-item">Joined</div>
        <div className="members-table-header-item">Permission</div>
        <div className="members-table-header-item"></div>
      </div>

      {membersList}
    </div>
  );
};

export default MembersTable;
