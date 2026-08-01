import './row.scss';

// import type definitions
import type { ContextTeamProps } from '../../../../../shared/types/context/team';

// import dependencies
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';

// import local files
import MemberRowActions from './actions';
import Role from '../../../../../shared/permissions/role';
import { MemberPermissionBits } from '../../../../../shared/permissions/bitFlags';
import useUserContext from '../../../../context/user';

const isImageUrl = (url: string) => {
  if (typeof url !== 'string') {
    return false;
  }
  return url.match(/^https?:\/\//gim) !== null;
};

const MemberTableRow = ({
  member = {} as ContextTeamProps,
}: {
  member?: ContextTeamProps;
}) => {
  const { user } = useUserContext();

  const role = new Role('user', user.permission);

  const canManage =
    !member.isOwner &&
    user.email !== member.email &&
    role.hasPermission(MemberPermissionBits.MANAGE_TEAM);

  const memberPermission = 'Member';

  const date = dayjs(member.created_at).format('MMM DD, YYYY');
  const time = dayjs(member.created_at).format('hh:mm A');

  const avatarUrl = isImageUrl(member.avatar)
    ? member.avatar
    : `/icons/${member.avatar}.png`;

  const userAvatar = member.avatar ? (
    <img src={avatarUrl} className="member-row-image" />
  ) : (
    <div className="member-row-image-default">
      {member.email?.charAt(0).toUpperCase() || 'U'}
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

export default observer(MemberTableRow);
