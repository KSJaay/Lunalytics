// import local files
import { observer } from 'mobx-react-lite';
import IncidentIdMessage from '../id/message';
import useContextStore from '../../../context';

const IncidentContentMessages = ({ incidentId }: { incidentId: string }) => {
  const {
    incidentStore: { getIncidentById },
  } = useContextStore();

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
          createdAt={message.createdAt}
        />
      ))}
    </div>
  );
};

IncidentContentMessages.displayName = 'IncidentContentMessages';

export default observer(IncidentContentMessages);
