// import dependencies
import dayjs from 'dayjs';
import classNames from 'classnames';

const StatusIncidentBasic = ({ incidents = [], status }) => {
  const incidentsList = !incidents?.length ? [] : incidents;

  const containerClasses = classNames('sci-content', status);

  return (
    <div className={containerClasses}>
      <div className="sci-list">
        {incidentsList.map((incident, index) => (
          <div key={index}>
            <div className="scil-description">
              <span>{incident.status}</span> - {incident.message}
            </div>
            <div className="scil-timestamp">
              {dayjs(incident.created_at).format('MMM DD YYYY, HH:mm')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

StatusIncidentBasic.displayName = 'StatusIncidentBasic';

export default StatusIncidentBasic;
