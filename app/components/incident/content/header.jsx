// import dependencies
import dayjs from 'dayjs';

const IncidentContentHeader = ({ incident }) => {
  return (
    <div
      style={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--accent-800)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '2px solid var(--accent-500)',
        }}
      >
        <div style={{ color: 'var(--font-light-color)' }}>STATUS</div>
        <div>{incident.status}</div>
      </div>
      <div
        style={{
          backgroundColor: 'var(--accent-800)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '2px solid var(--accent-500)',
        }}
      >
        <div style={{ color: 'var(--font-light-color)' }}>CREATED AT</div>
        <div>
          {dayjs(new Date(incident.createdAt)).format('MMMM DD, YYYY HH:mm A')}
        </div>
      </div>
      <div
        style={{
          backgroundColor: 'var(--accent-800)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '2px solid var(--accent-500)',
        }}
      >
        <div style={{ color: 'var(--font-light-color)' }}>LAST UPDATE</div>
        <div>
          {dayjs(
            new Date(incident.messages[incident.messages.length - 1]?.createdAt)
          ).format('MMMM DD, YYYY HH:mm A')}
        </div>
      </div>
      <div
        style={{
          backgroundColor: 'var(--accent-800)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '2px solid var(--accent-500)',
        }}
      >
        <div style={{ color: 'var(--font-light-color)' }}>IS CLOSED</div>
        <div>{incident.isClosed ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
};

IncidentContentHeader.displayName = 'IncidentContentHeader';

IncidentContentHeader.propTypes = {};

export default IncidentContentHeader;
