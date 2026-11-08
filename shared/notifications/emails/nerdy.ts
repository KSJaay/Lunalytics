import React from 'react';

export interface NotificationNerdyEmailTemplateProps {
  id: string;
  serviceName: string;
  dashboardUrl: string;
  address: string;
  type: string;
  timestamp: string;
  status: string;
  latency: string;
  statusMessage: string;
}

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
}: NotificationNerdyEmailTemplateProps) => {
  return /*#__PURE__*/ React.createElement(
    'div',
    {
      style: {
        fontFamily: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
        backgroundColor: '#171a1c',
        color: '#f3f6fb',
        padding: '40px 0',
      },
    },
    /*#__PURE__*/ React.createElement(
      'table',
      {
        width: '100%',
        cellPadding: '0',
        cellSpacing: '0',
        style: {
          maxWidth: '700px',
          margin: '0 auto',
          backgroundColor: '#22272a',
          borderRadius: '14px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
        },
      },
      /*#__PURE__*/ React.createElement(
        'thead',
        null,
        /*#__PURE__*/ React.createElement(
          'tr',
          null,
          /*#__PURE__*/ React.createElement(
            'th',
            {
              style: {
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
              },
            },
            /*#__PURE__*/ React.createElement('img', {
              src: 'https://raw.githubusercontent.com/KSJaay/Lunalytics/refs/heads/main/public/icon-192x192.png',
              width: '36px',
              height: '36px',
            }),
            'Lunalytics - Outage Detected'
          )
        )
      ),
      /*#__PURE__*/ React.createElement(
        'tbody',
        null,
        /*#__PURE__*/ React.createElement(
          'tr',
          null,
          /*#__PURE__*/ React.createElement(
            'td',
            {
              style: {
                padding: '28px 32px',
              },
            },
            /*#__PURE__*/ React.createElement(
              'h2',
              {
                style: {
                  margin: '0 0 12px 0',
                  color: '#9fa9af',
                  fontSize: '20px',
                },
              },
              '\uD83D\uDEA8 Service Currently Unreachable'
            ),
            /*#__PURE__*/ React.createElement(
              'p',
              {
                style: {
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  color: '#f3f6fb',
                },
              },
              'Our monitoring system has detected that',
              ' ',
              /*#__PURE__*/ React.createElement(
                'strong',
                {
                  style: {
                    color: '#9fa9af',
                  },
                },
                serviceName
              ),
              ' is currently',
              ' ',
              /*#__PURE__*/ React.createElement(
                'strong',
                {
                  style: {
                    color: '#f31260',
                  },
                },
                'down/unreachable'
              ),
              '.'
            ),
            /*#__PURE__*/ React.createElement(
              'h3',
              {
                style: {
                  color: '#96c1f2',
                  fontSize: '16px',
                  marginBottom: '12px',
                },
              },
              '\uD83D\uDCCA Monitor Information'
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                style: {
                  fontFamily: "'Fira Code', monospace",
                  backgroundColor: '#171a1c',
                  borderRadius: '8px',
                  padding: '16px',
                  color: '#f3f6fb',
                  marginBottom: '24px',
                },
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: '8px',
                  },
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    style: {
                      color: '#9fa9af',
                    },
                  },
                  'ID:'
                ),
                /*#__PURE__*/ React.createElement('div', null, id)
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: '8px',
                  },
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    style: {
                      color: '#9fa9af',
                    },
                  },
                  'Name:'
                ),
                /*#__PURE__*/ React.createElement('div', null, serviceName)
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: '8px',
                  },
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    style: {
                      color: '#9fa9af',
                    },
                  },
                  'Address:'
                ),
                /*#__PURE__*/ React.createElement('div', null, address)
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: '8px',
                  },
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    style: {
                      color: '#9fa9af',
                    },
                  },
                  'Type:'
                ),
                /*#__PURE__*/ React.createElement('div', null, type)
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: '8px',
                  },
                },
                /*#__PURE__*/ React.createElement('div', {
                  style: {
                    color: '#9fa9af',
                  },
                }),
                /*#__PURE__*/ React.createElement('div', null)
              )
            ),
            /*#__PURE__*/ React.createElement(
              'h3',
              {
                style: {
                  color: '#96c1f2',
                  fontSize: '16px',
                  marginBottom: '12px',
                },
              },
              '\uD83C\uDF0D Status Breakdown'
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                style: {
                  fontFamily: "'Fira Code', monospace",
                  backgroundColor: '#171a1c',
                  borderRadius: '8px',
                  padding: '16px',
                  color: '#f3f6fb',
                  marginBottom: '24px',
                },
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: '8px',
                  },
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    style: {
                      color: '#9fa9af',
                    },
                  },
                  'Status:'
                ),
                /*#__PURE__*/ React.createElement('div', null, status)
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: '8px',
                  },
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    style: {
                      color: '#9fa9af',
                    },
                  },
                  'Latency:'
                ),
                /*#__PURE__*/ React.createElement('div', null, latency, ' ms')
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: '8px',
                  },
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    style: {
                      color: '#9fa9af',
                    },
                  },
                  'Message:'
                ),
                /*#__PURE__*/ React.createElement('div', null, statusMessage)
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: '8px',
                  },
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    style: {
                      color: '#9fa9af',
                    },
                  },
                  'Timestamp:'
                ),
                /*#__PURE__*/ React.createElement('div', null, timestamp)
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: '8px',
                  },
                },
                /*#__PURE__*/ React.createElement('div', {
                  style: {
                    color: '#9fa9af',
                  },
                }),
                /*#__PURE__*/ React.createElement('div', null)
              )
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                style: {
                  textAlign: 'center',
                  margin: '36px 0 12px',
                },
              },
              /*#__PURE__*/ React.createElement(
                'a',
                {
                  href: dashboardUrl,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  style: {
                    display: 'inline-block',
                    backgroundColor: '#0072f5',
                    color: '#f3f6fb',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '15px',
                    textDecoration: 'none',
                    fontWeight: '600',
                  },
                },
                'View Dashboard'
              )
            ),
            /*#__PURE__*/ React.createElement(
              'p',
              {
                style: {
                  margin: '0',
                  fontSize: '13px',
                  color: '#9fa9af',
                  textAlign: 'center',
                },
              },
              'You can manage notification preferences or review uptime logs in your dashboard.'
            )
          )
        )
      ),
      /*#__PURE__*/ React.createElement(
        'tfoot',
        null,
        /*#__PURE__*/ React.createElement(
          'tr',
          null,
          /*#__PURE__*/ React.createElement(
            'td',
            {
              style: {
                backgroundColor: '#292e31',
                padding: '16px',
                textAlign: 'center',
                fontSize: '12px',
                color: '#9fa9af',
                borderRadius: '0 0 16px 16px',
              },
            },
            /*#__PURE__*/ React.createElement(
              'a',
              {
                href: 'https://github.com/KSJaay/lunalytics',
                style: {
                  color: '#13a452',
                },
                target: '_blank',
                rel: 'noopener noreferrer',
              },
              'Lunalytics'
            ),
            ' ',
            '- Made with \u2764\uFE0F by KSJaay'
          )
        )
      )
    )
  );
};

export default NotificationNerdyEmailTemplate;
