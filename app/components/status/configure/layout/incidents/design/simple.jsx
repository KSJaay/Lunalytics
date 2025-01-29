// import dependencies
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const statusText = {
  Operational: 'All Systems Operational',
  Maintenance: 'Scheduled Maintenance',
  Incident: 'Partially Degraded Service',
  Outage: 'Degraded Service',
};

const StatusIncidentSimple = ({ incidents = [], size, titleSize, status }) => {
  const incidentsList = !incidents?.length ? [] : incidents;

  return (
    <div className={`status-configure-incidents-content ${status}`}>
      <div
        className={`status-configure-incident-title ${size} title-${titleSize}`}
      >
        <div>Monitor issues</div>
        <div className="subtitle">{statusText[status]}</div>
      </div>
      <div className="status-configure-incidents-list">
        {incidentsList.map((incident, index) => (
          <div key={index}>
            <div className="scil-description">
              <span>{incident.title}</span> - {incident.description}
            </div>
            <div className="scil-timestamp">
              {dayjs(incident.timestamp).format('MMM DD YYYY, HH:mm')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

StatusIncidentSimple.displayName = 'StatusIncidentSimple';

StatusIncidentSimple.propTypes = {
  incidents: PropTypes.array.isRequired,
  size: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  titleSize: PropTypes.string.isRequired,

};

export default StatusIncidentSimple;
