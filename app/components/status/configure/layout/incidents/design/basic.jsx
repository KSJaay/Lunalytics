// import dependencies
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const StatusIncidentBasic = ({ incidents = [], status }) => {
  const incidentsList = !incidents?.length ? [] : incidents;

  const containerClasses = classNames(
    'status-configure-incidents-content',
    status
  );

  return (
    <div className={containerClasses}>
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

StatusIncidentBasic.displayName = 'StatusIncidentBasic';

StatusIncidentBasic.propTypes = {
  incidents: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
};

export default StatusIncidentBasic;
