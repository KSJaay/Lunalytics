// import dependencies
import classNames from 'classnames';
import { FaClock } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';
import { IoWarning } from 'react-icons/io5';
import { RiIndeterminateCircleFill } from 'react-icons/ri';
import type { ContextIncidentProps } from '../../types/context/incident';

const incidentTypes = {
  Outage: <RiIndeterminateCircleFill size={24} color="var(--red-700)" />,
  Incident: <IoWarning size={24} color="var(--yellow-700)" />,
  Maintenance: <FaClock size={24} color="var(--blue-700)" />,
  Operational: <FaCircleCheck size={24} color="var(--green-700)" />,
};

interface NotificationsListProps {
  incidents: ContextIncidentProps[];
  selectedIncidentId: string | null;
  setActiveIncident: (incident: ContextIncidentProps) => void;
}

const NotificationsList = ({
  incidents = [],
  selectedIncidentId,
  setActiveIncident,
}: NotificationsListProps) => {
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
              {incidentTypes[incident.affect]}
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
