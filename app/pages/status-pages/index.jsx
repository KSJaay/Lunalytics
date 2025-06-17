// import dependencies
import { useState } from 'react';
import { Button } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';

// import local files
import useContextStore from '../../context';
import { FaPlus, IoReload } from '../../components/icons';
import SearchBar from '../../components/ui/searchBar';
import HomeMenuMobile from '../../components/notifications/menu/mobile';
import StatusPageTable from '../../components/status';
import { useNavigate } from 'react-router-dom';
import { PermissionsBits } from '../../../shared/permissions/bitFlags';
import Role from '../../../shared/permissions/role';

const Status = () => {
  const {
    userStore: { user },
  } = useContextStore();

  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const canManageStatusPages = new Role('user', user.permission).hasPermission(
    PermissionsBits.MANAGE_STATUS_PAGES
  );

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
            color="gray"
            iconLeft={<IoReload style={{ width: '20px', height: '20px' }} />}
            onClick={() => setSearch('')}
          />
          {canManageStatusPages ? (
            <Button
              id="status-add-page-button"
              iconLeft={<FaPlus style={{ width: '20px', height: '20px' }} />}
              color={'primary'}
              onClick={() => navigate('/status-pages/configure')}
            >
              New
            </Button>
          ) : null}
        </div>
        <div className="home-menu-buttons-mobile">
          <HomeMenuMobile />
        </div>
      </div>

      <StatusPageTable search={search} />
    </div>
  );
};

Status.displayName = 'Status';

Status.propTypes = {};

export default observer(Status);
