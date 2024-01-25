// import stylesheets
import './row.scss';

// import dependencies
import moment from 'moment';

// import local files
import MemberRowActions from './actions';

const positions = {
  1: 'Owner',
  2: 'Admin',
  3: 'Editor',
  4: 'Guest',
};

const MemberTableRow = ({ member = {}, currentUser = {} }) => {
  // Only user can manage is if the user is an admin or owner,
  // the member is not the current user,
  // and the member has a lower permission level
  const canManage =
    currentUser.canManage &&
    currentUser.email !== member.email &&
    member.permission > currentUser.permission;

  const memberPermission = !member.isVerified
    ? 'Unverified'
    : positions[member.permission];

  const date = moment(member.createdAt).format('MMM DD, YYYY');
  const time = moment(member.createdAt).format('hh:mm A');

  const avatar = member.avatar ? `/icons/${member.avatar}.png` : '/logo.svg';

  return (
    <div className="member-table-row">
      <div className="member-row-name-container">
        <img src={avatar} className="member-row-image" />
        <div className="member-row-details">
          <div className="member-row-display-name">{member.displayName}</div>
          <div className="member-row-email">{member.email}</div>
        </div>
      </div>
      <div className="member-row-timestamp">
        <div className="member-row-timestamp-date">{date}</div>
        <div className="member-row-timestamp-time">{time}</div>
      </div>
      <div className="member-row-permission">{memberPermission}</div>
      <div className="member-row-body-icons">
        <MemberRowActions member={member} canManage={canManage} />
      </div>
    </div>
  );
};

export default MemberTableRow;
