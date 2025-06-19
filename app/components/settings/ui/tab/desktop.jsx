// import dependencies
import PropTypes from 'prop-types';

const tabs = [
  { title: 'GENERAL', items: ['Account', 'Appearance'] },
  { title: 'WORKSPACE', items: ['API Token', 'Manage Team', 'About'] },
];

const SettingsTab = ({ tab, handleTabUpdate }, index) => {
  const tabsList = tabs.map(({ title, items }) => {
    const itemsList = items.map((name) => {
      const active = name === tab;
      return (
        <div
          key={name}
          className={`settings-tab-text ${active ? 'active' : ''}`}
          onClick={() => handleTabUpdate(name)}
          id={name.replace(' ', '-')}
        >
          {name}
        </div>
      );
    });

    return (
      <div key={title + index}>
        {title && <div className="settings-tab-title">{title}</div>}
        <div>{itemsList}</div>
      </div>
    );
  });

  return <div className="settings-tab">{tabsList}</div>;
};

SettingsTab.displayName = 'SettingsTab';

SettingsTab.propTypes = {
  tab: PropTypes.string.isRequired,
  handleTabUpdate: PropTypes.func.isRequired,
};

export default SettingsTab;
