import './style.scss';

// import type definitions
import type { ContextTeamProps } from '../../../../../shared/types/context/team';

// import local files
import MemberTableRow from './row';

const MembersTable = ({ members = [] }: { members: ContextTeamProps[] }) => {
  const membersList = members.map((member, index) => (
    <MemberTableRow key={index} member={member} />
  ));

  return (
    <div className="members-table">
      <div className="members-table-header">
        <div className="members-table-header-item">Name</div>
        <div className="members-table-header-item joined">Joined</div>
        <div className="members-table-header-item">Permission</div>
        <div className="members-table-header-item"></div>
      </div>

      {membersList}
    </div>
  );
};

MembersTable.displayName = 'MembersTable';

export default MembersTable;
