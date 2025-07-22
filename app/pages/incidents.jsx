// import styles
import '../styles/pages/incidents.scss';

// import dependencies

import { observer } from 'mobx-react-lite';
import { Button } from '@lunalytics/ui';
import { useEffect, useMemo, useState } from 'react';

// import local files
import useContextStore from '../context';
import Navigation from '../components/navigation';
import NotificationsList from '../components/incident/list';
import HomeIncidentHeader from '../components/incident/header';
import IncidentContent from '../components/incident/content';
import IncidentCreateModal from '../components/modal/incident/create';

const Notifications = () => {
  const {
    modalStore: { openModal },
    incidentStore: { allIncidents, activeIncident, setActiveIncident },
  } = useContextStore();

  const [search, setSearch] = useState(null);

  useEffect(() => {
    if (!activeIncident && allIncidents[0]) {
      setActiveIncident(allIncidents[0]);
    }
  }, [allIncidents, activeIncident]);

  const handleSearchUpdate = (search = '') => {
    setSearch(search.trim());
  };

  const incidents = useMemo(
    () =>
      allIncidents.filter((incident) => {
        if (search) {
          const lowercaseSearch = search?.toLowerCase() || '';
          return (
            incident?.title?.toLowerCase()?.includes(lowercaseSearch) ||
            incident?.status?.toLowerCase()?.includes(lowercaseSearch) ||
            incident?.affect?.toLowerCase()?.includes(lowercaseSearch)
          );
        }
        return true;
      }),
    [search, allIncidents]
  );

  return (
    <Navigation
      activeUrl="/incidents"
      handleSearchUpdate={handleSearchUpdate}
      leftChildren={
        <NotificationsList
          incidents={incidents}
          selectedIncidentId={activeIncident?.incidentId}
          setActiveIncident={setActiveIncident}
        />
      }
      leftButton={
        <Button
          variant="flat"
          fullWidth
          onClick={() => openModal(<IncidentCreateModal />, false)}
        >
          Add Incident
        </Button>
      }
      onLeftClick={() => {}}
      header={{ HeaderComponent: HomeIncidentHeader }}
    >
      {!activeIncident ? (
        <div
          style={{
            height: '100%',
            width: '100%',
            fontWeight: 'bold',
            fontSize: 'var(--font-2xl)',
            color: 'var(--font-light-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div>No incidents found</div>
        </div>
      ) : (
        <IncidentContent />
      )}
    </Navigation>
  );
};

Notifications.displayName = 'Notifications';

Notifications.propTypes = {};

export default observer(Notifications);
