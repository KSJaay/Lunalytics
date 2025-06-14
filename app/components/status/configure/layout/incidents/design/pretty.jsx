// import dependencies
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const StatusIncidentPretty = ({
  incidents = [],
  size,
  status,
  titleSize = 'XS',
  title,
}) => {
  const incidentsList = !incidents?.length ? [] : incidents;

  return (
    <div className={`sci-content ${status}`}>
      <div className={`sci-title ${size} title-${titleSize}`}>
        <div>{title}</div>
      </div>
      <div className="sci-list">
        {incidentsList
          .map((incident, index) => (
            <div key={index}>
              <div className={`scil-title ${incident.status}`}>
                {incident.status}
                <span className="scil-description"> - {incident.message}</span>
              </div>
              <div></div>
              <div className="scil-timestamp">
                {dayjs(incident.createdAt).format('MMM DD YYYY, HH:mm')}
              </div>
            </div>
          ))
          .reverse()}
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
