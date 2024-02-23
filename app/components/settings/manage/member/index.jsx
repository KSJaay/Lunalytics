import './style.scss';

// import dependencies
import PropTypes from 'prop-types';

// import local files
import MemberTableRow from './row';
import { userPropType } from '../../../../utils/propTypes';

const MembersTable = ({ members = [] }) => {
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

MembersTable.propTypes = {
  members: PropTypes.arrayOf(userPropType).isRequired,
};

export default MembersTable;
