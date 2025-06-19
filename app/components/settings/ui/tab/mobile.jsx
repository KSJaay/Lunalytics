// import dependencies
import PropTypes from 'prop-types';
import {
  FaChevronRight,
  FaUserCircle,
  IoColorPalette,
  IoMdHelpCircle,
  FaUsers,
} from '../../../icons';
import { IoKey } from 'react-icons/io5';

const tabs = [
  {
    title: 'General Settings',
    items: [
      {
        name: 'Account',
        icon: <FaUserCircle style={{ width: '25px', height: '25px' }} />,
      },
      {
        name: 'Appearance',
        icon: <IoColorPalette style={{ width: '25px', height: '25px' }} />,
      },
    ],
  },
  {
    title: 'Workspace Settings',
    items: [
      {
        name: 'API Token',
        icon: <IoKey style={{ width: '25px', height: '25px' }} />,
      },
      {
        name: 'Manage Team',
        icon: <FaUsers style={{ width: '25px', height: '25px' }} />,
      },
      {
        name: 'About',
        icon: <IoMdHelpCircle style={{ width: '25px', height: '25px' }} />,
      },
    ],
  },
];

const SettingsMobileTabs = ({ handleTabChange }) => {
  const tabsList = tabs.map(({ title, items }) => {
    const itemsList = items.map((item) => {
      return (
        <div
          key={item.name}
          className="settings-mobile-tab-text"
          onClick={() => handleTabChange(item.name)}
        >
          {item.icon}
          <div style={{ flex: 1 }}>{item.name}</div>
          <FaChevronRight style={{ width: '20px', height: '20px' }} />
        </div>
      );
    });

    return (
      <div key={title}>
        {title && <div className="settings-mobile-tab-title">{title}</div>}
        <div className="settings-mobile-tab-items">{itemsList}</div>
      </div>
    );
  });

  return <div className="settings-mobile-tabs mobile-shown">{tabsList}</div>;
};

SettingsMobileTabs.displayName = 'SettingsMobileTabs';

SettingsMobileTabs.propTypes = { handleTabChange: PropTypes.func.isRequired };

export default SettingsMobileTabs;
