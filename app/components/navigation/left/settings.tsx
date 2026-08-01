// import node_modules
import { observer } from 'mobx-react-lite';
import { IoMdHelpCircle } from 'react-icons/io';
import { IoColorPalette, IoKey } from 'react-icons/io5';
import { FaPaperPlane, FaUserCircle, FaUsers } from 'react-icons/fa';

// import local files
import Menu from '../../ui/menu';
import ManageTeam from '../../settings/manage';
import SettingAbout from '../../settings/about';
import ManageApiTokens from '../../settings/api';
import ManageInvites from '../../settings/invite';
import SettingsAccount from '../../settings/account';
import useMemberContext from '../../../context/member';
import SettingsPersonalisation from '../../settings/personalisation';
import { MemberPermissionBits } from '../../../../shared/permissions/bitFlags';

const settingTabs = [
  {
    title: 'General',
    items: [
      {
        id: 'my-account',
        title: 'My Account',
        permission: null,
        component: SettingsAccount,
        icon: <FaUserCircle />,
      },
      {
        id: 'appearance',
        title: 'Appearance',
        permission: null,
        component: SettingsPersonalisation,
        icon: <IoColorPalette />,
      },
    ],
  },
  {
    title: 'Workspaces',
    items: [
      {
        id: 'api-token',
        title: 'API Token',
        permission: MemberPermissionBits.ADMINISTRATOR,
        component: ManageApiTokens,
        icon: <IoKey />,
      },
      {
        id: 'invites',
        title: 'Invites',
        permission: MemberPermissionBits.ADMINISTRATOR,
        component: ManageInvites,
        icon: <FaPaperPlane />,
      },
      {
        id: 'manage-team',
        title: 'Manage Team',
        permission: MemberPermissionBits.ADMINISTRATOR,
        component: ManageTeam,
        icon: <FaUsers />,
      },
    ],
  },
  {
    title: 'Lunalytics',
    items: [
      {
        id: 'about',
        title: 'About',
        permission: null,
        component: SettingAbout,
        icon: <IoMdHelpCircle />,
      },
    ],
  },
];

const LeftNavigationSettings = observer(() => {
  const { member } = useMemberContext();

  const filteredTabs = settingTabs
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

export default LeftNavigationSettings;
