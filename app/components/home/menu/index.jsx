import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { Button } from '@lunalytics/ui';

// import local files
import { FaPlus, IoReload } from '../../icons';
import MenuLayoutDropdown from './layout';
import MenuStatusDropdown from './status';
import SearchBar from '../../ui/searchBar';
import useContextStore from '../../../context';
import HomeMenuMobile from './mobile';
import MonitorConfigureModal from '../../modal/monitor/configure';
import Role from '../../../../shared/permissions/role';
import { PermissionsBits } from '../../../../shared/permissions/bitFlags';

const HomeMenu = ({ handleReset, search, setSearch }) => {
  const {
    userStore: { user },
    modalStore: { openModal, closeModal },
    globalStore: { addMonitor },
  } = useContextStore();

  const canManageMonitors = new Role('user', user.permission).hasPermission(
    PermissionsBits.MANAGE_MONITORS
  );

  return (
    <div className="home-menu">
      <SearchBar onChange={setSearch} value={search} placeholder="Search..." />

      <div className="home-menu-buttons">
        <Button
          iconLeft={<IoReload style={{ width: '20px', height: '20px' }} />}
          onClick={handleReset}
          color="gray"
        />

        <MenuStatusDropdown />
        <MenuLayoutDropdown />

        {canManageMonitors ? (
          <Button
            id="home-add-monitor-button"
            onClick={() =>
              openModal(
                <MonitorConfigureModal
                  closeModal={closeModal}
                  handleMonitorSubmit={addMonitor}
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
        <HomeMenuMobile handleReset={handleReset} />
      </div>
    </div>
  );
};

HomeMenu.displayName = 'HomeMenu';

HomeMenu.propTypes = {
  handleReset: PropTypes.func,
  search: PropTypes.string,
  setSearch: PropTypes.func,
};

export default observer(HomeMenu);
