// import dependencies
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const statusText = {
  Operational: 'All Systems Operational',
  Maintenance: 'Scheduled Maintenance',
  Incident: 'Partially Degraded Service',
  Outage: 'Degraded Service',
};

const StatusIncidentPretty = ({ incidents = [], size, status, titleSize }) => {
  const incidentsList = !incidents?.length ? [] : incidents;

  return (
    <div className={`sci-content ${status}`}>
      <div className={`sci-title ${size} title-${titleSize}`}>
        <div>Monitor issues</div>
        <div className="subtitle">{statusText[status]}</div>
      </div>
      <div className="sci-list">
        {incidentsList.map((incident, index) => (
          <div key={index}>
            <div className={`scil-title ${incident.type}`}>
              {incident.title}
              <span className="scil-description">
                {' '}
                - {incident.description}
              </span>
            </div>
            <div></div>
            <div className="scil-timestamp">
              {dayjs(incident.timestamp).format('MMM DD YYYY, HH:mm')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

StatusIncidentPretty.displayName = 'StatusIncidentPretty';

StatusIncidentPretty.propTypes = {
  incidents: PropTypes.array.isRequired,
  size: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  titleSize: PropTypes.string.isRequired,
};

export default StatusIncidentPretty;
