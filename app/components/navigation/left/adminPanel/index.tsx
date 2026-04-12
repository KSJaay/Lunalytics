// import node_modules
import { observer } from 'mobx-react-lite';
import { BsShieldLockFill } from 'react-icons/bs';

// import local files
import Menu from '../../../ui/menu';
import ManageTeam from '../../../settings/manage';
import useMemberContext from '../../../../context/member';
import SettingsAuthentication from '../../../settings/authentication';
import { UserPermissionBits } from '../../../../../shared/permissions/bitFlags';
import { FaUsers } from 'react-icons/fa';

const adminTabs = [
  {
    title: 'Workspaces',
    items: [
      {
        id: 'authentication',
        title: 'Authentication',
        permission: UserPermissionBits.ADMINISTRATOR,
        component: SettingsAuthentication,
        icon: <BsShieldLockFill />,
      },
      // {
      //   id: 'invites',
      //   title: 'Invites',
      //   permission: UserPermissionBits.MANAGE_INVITES,
      //   component: ManageInvites,
      // },
      {
        id: 'manage-team',
        title: 'Manage Team',
        permission: UserPermissionBits.MANAGE_TEAM,
        component: ManageTeam,
        icon: <FaUsers />,
      },
    ],
  },
];

const LeftNavigationAdminPanel = observer(() => {
  const { member } = useMemberContext();

  const filteredTabs = adminTabs
    .map((tab) => {
      const filteredItems = tab.items.filter((item) => {
        if (!item.permission) {
          return true;
        }

        return member?.role.hasPermission(item.permission);
      });

      return { ...tab, items: filteredItems };
    })
    .filter((tab) => tab.items.length > 0);

  return <Menu items={filteredTabs} />;
});

export default LeftNavigationAdminPanel;
