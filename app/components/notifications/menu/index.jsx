import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';
import { Button } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';

// import local files
import { FaPlus, IoReload } from '../../icons';
// import MenuLayoutDropdown from './layout';
import MenuPlatformDropdown from './platform';
import SearchBar from '../../ui/searchBar';
import useContextStore from '../../../context';
import HomeMenuMobile from './mobile';
import NotificationModal from '../../modal/notification';
import { PermissionsBits } from '../../../../shared/permissions/bitFlags';
import Role from '../../../../shared/permissions/role';

const NotificationsMenu = ({ search, setSearch, platform, setPlatform }) => {
  const {
    userStore: { user },
    modalStore: { openModal, closeModal },
    notificationStore: { addNotification },
  } = useContextStore();

  const canManageNotifications = new Role(
    'user',
    user.permission
  ).hasPermission(PermissionsBits.MANAGE_NOTIFICATIONS);

  return (
    <div className="home-menu">
      <SearchBar
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        placeholder="Search..."
      />

      <div className="home-menu-buttons">
        <Button
          color="gray"
          iconLeft={<IoReload style={{ width: '20px', height: '20px' }} />}
          onClick={() => {
            setSearch('');
            setPlatform('All');
          }}
        />

        <MenuPlatformDropdown platform={platform} setPlatform={setPlatform} />
        {/* <MenuLayoutDropdown /> */}

        {canManageNotifications ? (
          <Button
            id="home-add-notification-button"
            onClick={() =>
              openModal(
                <NotificationModal
                  closeModal={closeModal}
                  addNotification={addNotification}
                />,
                false
              )
            }
            iconLeft={<FaPlus style={{ width: '20px', height: '20px' }} />}
            color="primary"
          >
            New
          </Button>
        ) : null}
      </div>
      <div className="home-menu-buttons-mobile">
        <HomeMenuMobile
          handleReset={() => {
            setSearch('');
            setPlatform('all');
          }}
        />
      </div>
    </div>
  );
};

NotificationsMenu.displayName = 'NotificationsMenu';

NotificationsMenu.propTypes = {
  search: PropTypes.string,
  setSearch: PropTypes.func,
  platform: PropTypes.string,
  setPlatform: PropTypes.func,
};

export default observer(NotificationsMenu);
