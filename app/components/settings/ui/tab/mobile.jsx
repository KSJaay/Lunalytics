// import dependencies
import PropTypes from 'prop-types';
import {
  FaChevronRight,
  FaUserCircle,
  IoColorPalette,
  MdHelpCircle,
} from '../../../icons';
import FaUsers from '../../../icons/faUsers';

const tabs = [
  {
    title: 'General Settings',
    items: [
      { name: 'Account', icon: <FaUserCircle /> },
      { name: 'Appearance', icon: <IoColorPalette /> },
    ],
  },
  {
    title: 'Workspace Settings',
    items: [
      { name: 'Manage Team', icon: <FaUsers /> },
      { name: 'About', icon: <MdHelpCircle /> },
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
          <FaChevronRight width={20} height={20} />
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
