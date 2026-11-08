// import local files
import { observer } from 'mobx-react-lite';
import IncidentIdMessage from '../id/message';
import useIncidentContext from '../../../context/incidents';

const IncidentContentMessages = ({ incidentId }: { incidentId: string }) => {
  const { getIncidentById } = useIncidentContext();

  const incident = getIncidentById(incidentId);

  if (!incident) return null;

  return (
    <div className="icp-message-container">
      <div className="input-label">Incident Messages</div>
      {incident.messages.map((message, index) => (
        <IncidentIdMessage
          key={index}
          incidentPosition={index}
          incidentId={incident.incidentId}
          message={message.message}
          status={message.status}
          createdAt={message.created_at}
        />
      ))}
    </div>
  );
};

IncidentContentMessages.displayName = 'IncidentContentMessages';

export default observer(IncidentContentMessages);
