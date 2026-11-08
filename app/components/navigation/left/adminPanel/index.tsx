// import node_modules
import { observer } from 'mobx-react-lite';
import { FaUsers } from 'react-icons/fa';
import { BsRocketTakeoffFill, BsShieldLockFill } from 'react-icons/bs';

// import local files
import Menu from '../../../ui/menu';
import ManageWorkspaces from './workspaces';
import useMemberContext from '../../../../context/member';
import SettingsAuthentication from '../../../settings/authentication';
import { UserPermissionBits } from '../../../../../shared/permissions/bitFlags';
import ManageUsers from './users';

const adminTabs = [
  {
    title: 'Workspaces',
    items: [
      {
        id: 'manage-workspaces',
        title: 'Manage Workspaces',
        permission: UserPermissionBits.MANAGE_WORKSPACES,
        component: ManageWorkspaces,
        icon: <BsRocketTakeoffFill />,
      },
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
        title: 'Manage Users',
        permission: UserPermissionBits.MANAGE_TEAM,
        component: ManageUsers,
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
