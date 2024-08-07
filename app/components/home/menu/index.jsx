import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

// import local files
import Button from '../../ui/button';

// import icons
import FaPlus from '../../icons/faPlus';
import FaReload from '../../icons/faReload';
import MenuLayoutDropdown from './layout';
import MenuStatusDropdown from './status';
import SearchBar from '../../ui/searchBar';
import useContextStore from '../../../context';
import HomeMenuMobile from './mobile';
import MonitorConfigureModal from '../../modal/monitor/configure';

const HomeMenu = ({ handleReset, search, setSearch }) => {
  const {
    userStore: { user },
    modalStore: { openModal, closeModal },
    globalStore: { addMonitor },
  } = useContextStore();

  return (
    <div className="home-menu">
      <SearchBar onChange={setSearch} value={search} placeholder="Search..." />

      <div className="home-menu-buttons">
        <Button
          iconLeft={<FaReload width={20} height={20} />}
          onClick={handleReset}
        />

        <MenuStatusDropdown />
        <MenuLayoutDropdown />

        {user.canEdit ? (
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
            iconLeft={<FaPlus width={20} height={20} />}
            color={'primary'}
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
