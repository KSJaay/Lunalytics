// import dependencies
import PropTypes from 'prop-types';

// import local files
import useContextStore from '../../context';
import { FaPlus, IoReload, PiBroadcast } from '../../components/icons';
import Button from '../../components/ui/button';
import SearchBar from '../../components/ui/searchBar';
import HomeMenuMobile from '../../components/notifications/menu/mobile';

const Status = ({ setSearch, search = '' }) => {
  const {
    userStore: { user },
    statusStore: { allStatusPages },
  } = useContextStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div className="home-menu">
        <SearchBar
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search..."
        />

        <div className="home-menu-buttons">
          <Button
            iconLeft={<IoReload style={{ width: '20px', height: '20px' }} />}
          />
          <Button
            iconLeft={<IoReload style={{ width: '20px', height: '20px' }} />}
          >
            Status
          </Button>
          <Button
            iconLeft={<IoReload style={{ width: '20px', height: '20px' }} />}
          >
            Filter
          </Button>
          {user.canEdit ? (
            <Button
              id="status-add-page-button"
              iconLeft={<FaPlus style={{ width: '20px', height: '20px' }} />}
              color={'primary'}
            >
              New
            </Button>
          ) : null}
        </div>
        <div className="home-menu-buttons-mobile">
          <HomeMenuMobile handleReset={() => {}} />
        </div>
      </div>
      {allStatusPages.length === 0 ? (
        <div className="notification-empty">
          <div className="notification-empty-icon">
            <PiBroadcast style={{ width: '64px', height: '64px' }} />
          </div>
          <div className="notification-empty-text">No status pages found</div>
        </div>
      ) : null}
    </div>
  );
};

Status.displayName = 'Status';

Status.propTypes = {
  setSearch: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
};

export default Status;
