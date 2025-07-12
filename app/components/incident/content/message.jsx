// import local files
import IncidentIdMessage from '../id/message';

const IncidentContentMessages = ({ incident }) => {
  return (
    <div style={{ marginTop: '-0.5rem', gap: '1rem', display: 'flex', flexDirection: 'column' }}>
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

IncidentContentMessages.propTypes = {};

export default IncidentContentMessages;
