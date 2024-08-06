import './row.scss';

// import dependencies
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';

// import local files
import MemberRowActions from './actions';
import useContextStore from '../../../../context';
import { userPropType } from '../../../../../shared/utils/propTypes';

const positions = { 1: 'Owner', 2: 'Admin', 3: 'Editor', 4: 'Guest' };

const isImageUrl = (url) => {
  if (typeof url !== 'string') {
    return false;
  }
  return url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/gim) !== null;
};

const MemberTableRow = ({ member = {} }) => {
  // Only user can manage is if the user is an admin or owner,
  // the member is not the current user,
  // and the member has a lower permission level

  const {
    userStore: { user },
  } = useContextStore();

  const canManage =
    user.canManage &&
    user.email !== member.email &&
    member.permission > user.permission;

  const memberPermission = !member.isVerified
    ? 'Unverified'
    : positions[member.permission];

  const date = dayjs(member.createdAt).format('MMM DD, YYYY');
  const time = dayjs(member.createdAt).format('hh:mm A');

  const avatarUrl = isImageUrl(member.avatar)
    ? member.avatar
    : `/icons/${member.avatar}.png`;

  const userAvatar = member.avatar ? (
    <img src={avatarUrl} className="member-row-image" />
  ) : (
    <div className="member-row-image-default">
      {member.displayName?.charAt(0)}
    </div>
  );

  return (
    <div className="member-table-row">
      <div className="member-row-name-container">
        {userAvatar}
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

MemberTableRow.displayName = 'MemberTableRow';

MemberTableRow.propTypes = {
  member: userPropType.isRequired,
};

export default observer(MemberTableRow);
