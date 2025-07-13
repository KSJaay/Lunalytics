// import dependencies
import classNames from 'classnames';
import { FaClock } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';
import { IoWarning } from 'react-icons/io5';
import { RiIndeterminateCircleFill } from 'react-icons/ri';

const incidentTypes = {
  Investigating: <RiIndeterminateCircleFill size={24} color="var(--red-700)" />,
  Identified: <IoWarning size={24} color="var(--yellow-700)" />,
  Monitoring: <FaClock size={24} color="var(--blue-700)" />,
  Resolved: <FaCircleCheck size={24} color="var(--green-700)" />,
};

const NotificationsList = ({
  incidents = [],
  selectedIncidentId,
  setActiveIncident,
}) => {
  if (!incidents || incidents.length === 0) {
    return <div style={{ flex: 1 }}></div>;
  }

  return (
    <div className="navigation-incident-items">
      {incidents.map((incident) => {
        const classes = classNames('item', {
          'item-active': selectedIncidentId === incident?.incidentId,
        });

        return (
          <div
            className={classes}
            key={incident.incidentId}
            onClick={() => setActiveIncident(incident)}
          >
            <div className="content">
              <div>{incident.title}</div>
              <span>{incident.status}</span>
            </div>
            <div className="icon-container">
              {incidentTypes[incident.status]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

NotificationsList.displayName = 'NotificationsList';

NotificationsList.propTypes = {};

export default NotificationsList;
