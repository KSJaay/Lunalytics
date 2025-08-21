// import dependencies
import dayjs from 'dayjs';
import type { IncidentProps } from '../../../types/incident';

const IncidentContentHeader = ({ incident }: { incident: IncidentProps }) => {
  return (
    <div className="ihc-container">
      <div className="ihc-content">
        <div className="ihc-content-title">STATUS</div>
        <div>{incident.status}</div>
      </div>
      <div className="ihc-content">
        <div className="ihc-content-title">CREATED AT</div>
        <div>
          {dayjs(new Date(incident.createdAt)).format('MMMM DD, YYYY HH:mm A')}
        </div>
      </div>
      <div className="ihc-content">
        <div className="ihc-content-title">LAST UPDATE</div>
        <div>
          {dayjs(
            new Date(incident.messages[incident.messages.length - 1]?.createdAt)
          ).format('MMMM DD, YYYY HH:mm A')}
        </div>
      </div>
      <div className="ihc-content">
        <div className="ihc-content-title">IS CLOSED</div>
        <div>{incident.isClosed ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
};

IncidentContentHeader.displayName = 'IncidentContentHeader';

export default IncidentContentHeader;
