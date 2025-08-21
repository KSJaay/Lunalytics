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
import { filterData } from '../../shared/utils/search';
import useScreenSize from '../hooks/useScreenSize';

const Notifications = () => {
  const {
    modalStore: { openModal },
    incidentStore: { allIncidents, activeIncident, setActiveIncident },
  } = useContextStore();

  const [search, setSearch] = useState<string | null>(null);
  const screenSize = useScreenSize();
  const isDesktop = useMemo(() => screenSize === 'desktop', [screenSize]);

  useEffect(() => {
    if (!activeIncident && isDesktop) {
      setActiveIncident(allIncidents[0]?.incidentId);
    }
  }, [allIncidents, activeIncident, isDesktop]);

  const handleSearchUpdate = (search = '') => {
    setSearch(search.trim());
  };

  const incidents = useMemo(() => {
    if (!search) return allIncidents;

    return filterData(allIncidents, search, ['title', 'status', 'affect']);
  }, [search, allIncidents]);

  if (!isDesktop && activeIncident) {
    return (
      <div className="monitor-mobile-container">
        <HomeIncidentHeader isMobile={!isDesktop} />
        <IncidentContent />
      </div>
    );
  }

  const content = isDesktop ? <IncidentContent /> : null;

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
      header={{ HeaderComponent: HomeIncidentHeader }}
    >
      {!activeIncident ? (
        <div className="monitor-none-exist">
          <div>No incidents found</div>
        </div>
      ) : (
        content
      )}
    </Navigation>
  );
};

Notifications.displayName = 'Notifications';

export default observer(Notifications);
