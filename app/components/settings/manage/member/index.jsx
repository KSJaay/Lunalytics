import './style.scss';

import MemberTableRow from './row';

const MembersTable = ({ members = [] }) => {
  const membersList = members.map((member, index) => (
    <MemberTableRow key={index} member={member} />
  ));

  return (
    <div className="members-table">
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
