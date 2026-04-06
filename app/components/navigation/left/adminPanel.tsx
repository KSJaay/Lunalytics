// import node_modules
import { observer } from 'mobx-react-lite';

// import local files
import Menu from '../../ui/menu';
import ManageTeam from '../../settings/manage';
import ManageInvites from '../../settings/invite';
import { UserPermissionBits } from '../../../../shared/permissions/bitFlags';

const settingTabs = [
  {
    title: 'Workspaces',
    items: [
      {
        id: 'invites',
        title: 'Invites',
        permission: UserPermissionBits.MANAGE_INVITES,
        component: ManageInvites,
      },
      {
        id: 'manage-team',
        title: 'Manage Team',
        permission: UserPermissionBits.MANAGE_TEAM,
        component: ManageTeam,
      },
    ],
  },
];

const LeftNavigationAdminPanel = observer(() => {
  return <Menu items={settingTabs} />;
});

export default LeftNavigationAdminPanel;
