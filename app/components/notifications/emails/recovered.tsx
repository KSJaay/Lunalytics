const NotificationRecoveredEmailTemplate = ({
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
        padding: '32px 0',
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
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#22272a',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: '#13a452',
                color: '#f3f6fb',
                padding: '20px 0',
                fontSize: '22px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                borderRadius: '16px 16px 0 0',
              }}
            >
              <img
                src="https://raw.githubusercontent.com/KSJaay/Lunalytics/refs/heads/main/public/icon-192x192.png"
                width={'36px'}
                height={'36px'}
              />
              Lunalytics - Service Restored
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={{ padding: '32px' }}>
              <h2
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#17c964',
                }}
              >
                ✅ Your monitored service is back online
              </h2>

              <p
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#f3f6fb',
                }}
              >
                Lunalytics detected that{' '}
                <strong style={{ color: '#9fa9af' }}>{serviceName}</strong> has
                successfully recovered and is now{' '}
                <strong style={{ color: '#13a452' }}>operational</strong>.
              </p>

              <p
                style={{
                  margin: '0 0 24px 0',
                  fontSize: '14px',
                  color: '#9fa9af',
                }}
              >
                Resolved at: {timestamp}
              </p>

              <div
                style={{
                  backgroundColor: '#171a1c',
                  border: '1px solid #22272a',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '28px',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '15px',
                    color: '#9fa9af',
                    lineHeight: '1.6',
                  }}
                >
                  Monitoring will continue to ensure your service remains
                  stable. You’ll be alerted again if any further issues occur.
                </p>
              </div>

              <div style={{ textAlign: 'center', margin: '28px 0' }}>
                <a
                  href={dashboardUrl}
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

export default NotificationRecoveredEmailTemplate;
