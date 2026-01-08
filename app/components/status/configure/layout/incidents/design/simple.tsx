// import dependencies
import dayjs from 'dayjs';

const StatusIncidentSimple = ({
  incidents = [],
  size,
  titleSize,
  title,
  status,
}) => {
  const incidentsList = !incidents?.length ? [] : incidents;

  return (
    <div className={`sci-content ${status}`}>
      <div className={`sci-title ${size} title-${titleSize}`}>
        <div>{title}</div>
      </div>
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

StatusIncidentSimple.displayName = 'StatusIncidentSimple';

export default StatusIncidentSimple;
