const tabs = (isAdmin: boolean) => [
  { title: 'GENERAL', items: ['Account', 'Appearance'] },
  {
    title: 'WORKSPACE',
    items: isAdmin
      ? ['API Token', 'Authentication', 'Invites', 'Manage Team', 'About']
      : ['Manage Team', 'About'],
  },
];

export type SettingsTabNames =
  | 'Account'
  | 'Appearance'
  | 'API Token'
  | 'Authentication'
  | 'Invites'
  | 'Manage Team'
  | 'About';

const SettingsTab = ({
  tab,
  handleTabUpdate,
  isAdmin = false,
}: {
  tab: SettingsTabNames;
  handleTabUpdate: (tab: SettingsTabNames) => void;
  isAdmin?: boolean;
}) => {
  const tabsList = tabs(isAdmin).map(({ title, items }) => {
    const itemsList = items.map((name) => {
      const active = name === tab;
      return (
        <div
          key={name}
          className={`settings-tab-text ${active ? 'active' : ''}`}
          onClick={() => handleTabUpdate(name as SettingsTabNames)}
          id={name.replace(' ', '-')}
        >
          {name}
        </div>
      );
    });

    return (
      <div key={title}>
        {title && <div className="settings-tab-title">{title}</div>}
        <div>{itemsList}</div>
      </div>
    );
  });

  return <div className="settings-tab">{tabsList}</div>;
};

SettingsTab.displayName = 'SettingsTab';

export default SettingsTab;
