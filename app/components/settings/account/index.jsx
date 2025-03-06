import './../ui/tab/tab.scss';
import './style.scss';

// import local files
import Button from '../../ui/button';
import SettingsAccountDesktopItem from './item/desktop';
import SettingsAccountMobileItem from './item/mobile';
import SettingsAccountAvatar from './avatar';

const accountItems = [
  {
    title: 'Email',
    id: 'email',
  },
  {
    title: 'Username',
    modalTitle: 'Edit your username',
    id: 'displayName',
    canEdit: true,
  },
  {
    title: 'Password',
    modalTitle: 'Change Password',
    id: 'password',
    canEdit: true,
  },
  {
    title: 'Transfer Ownership',
    id: 'transfer',
    description: 'Transfer ownership to another user',
    customButton: (
      <div className="settings-account-item-buttons">
        <Button color="red">Transfer Ownership</Button>
      </div>
    ),
    permissionLevel: 1,
  },
  {
    title: 'Delete Account',
    id: 'delete',
    description: 'Your account will be removed from our database',
    customButton: (
      <div className="settings-account-item-buttons">
        <Button outline="red">Delete Account</Button>
      </div>
    ),
    fontColor: 'red',
  },
];

const SettingsAccount = () => {
  return (
    <div className="settings-account-container">
      <SettingsAccountAvatar />

      <span className="mobile-hidden">
        {accountItems.map((item) => (
          <SettingsAccountDesktopItem key={item.title} {...item} />
        ))}
      </span>

      <span className="settings-account-mobile-container mobile-shown">
        {accountItems.map((item) => (
          <SettingsAccountMobileItem key={item.title} {...item} />
        ))}
      </span>
    </div>
  );
};

export default SettingsAccount;
