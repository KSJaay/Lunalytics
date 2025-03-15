import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const StatusConfigureLayoutHistoryList = ({ incidents = [], size }) => {
  const incidentsList = [];

  for (let i = 0; i < size; i++) {
    const today = new Date().setHours(0, 0, 0, 0);
    const ms = today - 86400000 * i;

    const exists = incidents.find(
      (incident) =>
        incident.created_at >= ms && incident.created_at < ms + 86400000
    );

    if (!exists) {
      incidentsList.push({ created_at: ms });
    } else {
      incidentsList.push(exists);
    }
  }

  return (
    <div className="sclh-container">
      <div className="sclh-title">PAST INCIDENTS</div>

      {incidentsList.map((incident, index) => (
        <div key={index}>
          <div className="sclh-date">
            {dayjs(incident.created_at).format('MMM DD, YYYY')}
          </div>
          <div className="sclh-subtitle">
            {!incident?.title ? 'No incidents reported.' : incident.title}
          </div>
        </div>
      ))}
    </div>
  );
};

StatusConfigureLayoutHistoryList.displayName =
  'StatusConfigureLayoutHistoryList';

StatusConfigureLayoutHistoryList.propTypes = {
  incidents: PropTypes.array.isRequired,
  size: PropTypes.number.isRequired,
};

export default StatusConfigureLayoutHistoryList;
