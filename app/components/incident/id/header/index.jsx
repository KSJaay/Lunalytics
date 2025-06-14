// import dependencies
import dayjs from 'dayjs';

// import local files
import IncidentIdHeaderItem from './item';
import IncidentIdHeaderItemImpact from './impact';

const IncidentIdHeader = ({ incident, handleClick, canManageIncidents }) => {
  return (
    <div className="iidh-item-container">
      {canManageIncidents ? (
        <IncidentIdHeaderItemImpact
          title="Impact"
          subtitle={incident.affect}
          onClick={handleClick}
          canManageIncidents={canManageIncidents}
        />
      ) : (
        <IncidentIdHeaderItem title="Impact" subtitle={incident.affect} />
      )}
      <IncidentIdHeaderItem title="Status" subtitle={incident.status} />
      <IncidentIdHeaderItem
        title="Created At"
        subtitle={dayjs(incident.createdAt).format('MMMM DD, YYYY HH:mm A')}
      />
    </div>
  );
};

export default IncidentIdHeader;
