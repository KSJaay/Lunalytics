const NotificationNerdyEmailTemplate = ({
  id,
  serviceName,
  dashboardUrl,
  address,
  type,
  timestamp,
  status,
  latency,
  statusMessage,
}: {
  id: string;
  serviceName: string;
  dashboardUrl: string;
  address?: string;
  type?: string;
  timestamp: string;
  status?: number;
  latency?: number;
  statusMessage?: string;
}) => {
  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
        backgroundColor: '#171a1c',
        color: '#f3f6fb',
        padding: '40px 0',
      }}
    >
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          backgroundColor: '#22272a',
          borderRadius: '14px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
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
                borderRadius: '16px 16px 0 0',
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
            <td style={{ padding: '28px 32px' }}>
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

              <h3
                style={{
                  color: '#96c1f2',
                  fontSize: '16px',
                  marginBottom: '12px',
                }}
              >
                📊 Monitor Information
              </h3>

              <div
                style={{
                  fontFamily: "'Fira Code', monospace",
                  backgroundColor: '#171a1c',
                  borderRadius: '8px',
                  padding: '16px',
                  color: '#f3f6fb',
                  marginBottom: '24px',
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ color: '#9fa9af' }}>ID:</div>
                  <div>{id}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ color: '#9fa9af' }}>Name:</div>
                  <div>{serviceName}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ color: '#9fa9af' }}>Address:</div>
                  <div>{address}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ color: '#9fa9af' }}>Type:</div>
                  <div>{type}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ color: '#9fa9af' }}></div>
                  <div></div>
                </div>
              </div>

              <h3
                style={{
                  color: '#96c1f2',
                  fontSize: '16px',
                  marginBottom: '12px',
                }}
              >
                🌍 Status Breakdown
              </h3>
              <div
                style={{
                  fontFamily: "'Fira Code', monospace",
                  backgroundColor: '#171a1c',
                  borderRadius: '8px',
                  padding: '16px',
                  color: '#f3f6fb',
                  marginBottom: '24px',
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ color: '#9fa9af' }}>Status:</div>
                  <div>{status}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ color: '#9fa9af' }}>Latency:</div>
                  <div>{latency} ms</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ color: '#9fa9af' }}>Message:</div>
                  <div>{statusMessage}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ color: '#9fa9af' }}>Timestamp:</div>
                  <div>{timestamp}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ color: '#9fa9af' }}></div>
                  <div></div>
                </div>
              </div>

              <div style={{ textAlign: 'center', margin: '36px 0 12px' }}>
                <a
                  href={dashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#0072f5',
                    color: '#f3f6fb',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '15px',
                    textDecoration: 'none',
                    fontWeight: '600',
                  }}
                >
                  View Dashboard
                </a>
              </div>

              <p
                style={{
                  margin: '0',
                  fontSize: '13px',
                  color: '#9fa9af',
                  textAlign: 'center',
                }}
              >
                You can manage notification preferences or review uptime logs in
                your dashboard.
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
                borderRadius: '0 0 16px 16px',
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

export default NotificationNerdyEmailTemplate;
