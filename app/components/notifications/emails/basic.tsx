const NotificationBasicEmailTemplate = ({
  serviceName,
  dashboardUrl,
  timestamp,
}: {
  serviceName: string;
  dashboardUrl: string;
  timestamp: string;
}) => {
  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
        backgroundColor: '#171a1c',
        padding: '24px',
        margin: '0',
        color: '#f3f6fb',
      }}
    >
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#22272a',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: '#b80a47',
                padding: '20px 0',
                fontSize: '22px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                color: '#f3f6fb',
              }}
            >
              <img
                src="https://raw.githubusercontent.com/KSJaay/Lunalytics/refs/heads/main/public/icon-192x192.png"
                width={'36px'}
                height={'36px'}
              />
              Lunalytics - Outage Detected
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td
              style={{
                padding: '24px',
                backgroundColor: '#22272a',
              }}
            >
              <h2
                style={{
                  margin: '0 0 12px 0',
                  color: '#9fa9af',
                  fontSize: '20px',
                }}
              >
                🚨 Service Currently Unreachable
              </h2>
              <p
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  color: '#f3f6fb',
                }}
              >
                Our monitoring system has detected that{' '}
                <strong style={{ color: '#9fa9af' }}>{serviceName}</strong> is
                currently{' '}
                <strong style={{ color: '#f31260' }}>down/unreachable</strong>.
              </p>

              <p
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '14px',
                  color: '#9fa9af',
                }}
              >
                Detected at: {timestamp}
              </p>

              <div style={{ textAlign: 'center', margin: '28px 0' }}>
                <a
                  href={dashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#0072f5',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '15px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    color: '#f3f6fb',
                  }}
                >
                  View Dashboard
                </a>
              </div>

              <p
                style={{
                  fontSize: '14px',
                  color: '#9fa9af',
                }}
              >
                You’ll be notified again when the service is back online.
              </p>
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <td
              style={{
                backgroundColor: '#292e31',
                padding: '16px',
                textAlign: 'center',
                fontSize: '12px',
                color: '#9fa9af',
              }}
            >
              <a
                href="https://github.com/KSJaay/lunalytics"
                style={{
                  color: '#13a452',
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Lunalytics
              </a>{' '}
              - Made with ❤️ by KSJaay
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default NotificationBasicEmailTemplate;
