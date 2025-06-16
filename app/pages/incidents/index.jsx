import '../../styles/pages/incidents.scss';

// import dependencies
import dayjs from 'dayjs';
import { useState } from 'react';
import { Button } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';
import relativeTime from 'dayjs/plugin/relativeTime';

// import local files
import useContextStore from '../../context';
import Role from '../../../shared/permissions/role';
import SearchBar from '../../components/ui/searchBar';
import IncidentItem from '../../components/incident/item';
import { FaPlus, IoReload } from '../../components/icons';
import { PermissionsBits } from '../../../shared/permissions/bitFlags';
import HomeMenuMobile from '../../components/notifications/menu/mobile';
import IncidentCreateModal from '../../components/modal/incident/create';
import { BsFillShieldLockFill } from 'react-icons/bs';

dayjs.extend(relativeTime);

const Incidents = () => {
  const {
    userStore: { user },
    modalStore: { openModal },
    incidentStore: { allIncidents },
  } = useContextStore();

  const [search, setSearch] = useState('');

  const canManageIncidents = new Role('user', user.permission).hasPermission(
    PermissionsBits.MANAGE_INCIDENTS
  );

  const filteredIncidents = allIncidents.filter((incident) => {
    if (!search) return true;

    return (
      incident.title?.toLowerCase().includes(search.toLowerCase()) ||
      incident.status?.toLowerCase().includes(search.toLowerCase()) ||
      incident.affect?.toLowerCase().includes(search.toLowerCase())
    );
  });

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

          {canManageIncidents ? (
            <Button
              id="status-add-page-button"
              iconLeft={<FaPlus style={{ width: '20px', height: '20px' }} />}
              color={'primary'}
              onClick={() => openModal(<IncidentCreateModal />, false)}
            >
              New
            </Button>
          ) : null}
        </div>
        <div className="home-menu-buttons-mobile">
          <HomeMenuMobile />
        </div>
      </div>

      {!filteredIncidents.length && (
        <div className="notification-empty">
          <div className="notification-empty-icon">
            <BsFillShieldLockFill style={{ width: '64px', height: '64px' }} />
          </div>
          <div className="notification-empty-text">No incidents found</div>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          padding: '0.5rem 0 1rem 0',
        }}
      >
        {filteredIncidents?.map((incident) => (
          <IncidentItem
            key={incident.incidentId}
            id={incident.incidentId}
            title={incident.title}
            lastUpdate={dayjs(incident.createdAt).fromNow()}
            affect={incident.affect}
            status={incident.status}
          />
        ))}
      </div>
    </div>
  );
};

Incidents.displayName = 'Incidents';

Incidents.propTypes = {};

export default observer(Incidents);
