import '../components/status/configure/preview/styles.scss';

// import types
import type { MonitorProps } from '../types/monitor';
import type { IncidentProps } from '../types/incident';

// import dependencies
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// import local files
import { createGetRequest } from '../services/axios';
import StatusFooter from '../components/status/configure/preview/footer';
import StatusPageHeader from '../components/status/configure/preview/header';
import StatusPageStatus from '../components/status/configure/preview/status';
import StatusPageUptime from '../components/status/configure/preview/uptime';
import StatusPageIncident from '../components/status/configure/preview/incident';
import StatusPageMetrics from '../components/status/configure/preview/metrics';
import StatusConfigureLayoutHistoryList from '../components/status/configure/layout/history/list';

const getMonitorStatus = (incident: IncidentProps, monitor: MonitorProps) => {
  if (incident?.status && incident?.status !== 'Resolved') {
    return incident?.affect;
  }

  if (monitor.isDown) {
    return 'Incident';
  }

  return 'Operational';
};

const getOverallStatus = (
  incident: IncidentProps,
  monitors: MonitorProps[]
) => {
  if (incident?.status && incident?.status !== 'Resolved') {
    return incident?.affect;
  }

  if (monitors?.some((monitor) => monitor.isDown)) {
    return 'Incident';
  }

  return 'Operational';
};

const StatusPage = ({ id }: { id?: string }) => {
  const [statusPage, setStatusPage] = useState(null);
  const navigate = useNavigate();

  const params = useParams();
  const statusPageId = params['statusPageId'] || id;

  const {
    settings: {
      font = 'Montserrat',
      theme = 'Auto',
      headerBackground = '#171a1c',
      background = '#171a1c',
      textColor = '#f3f6fb',
      highlight = '#17c964',
      homepageUrl = '/',
      logo = '/logo.svg',
      title: titleText = 'Lunalytics',
    } = {},
    layout = [],
  } = statusPage || {};

  function injectStylesheet(id: string, content: string = '') {
    let styleSheet = document.getElementById(id);

    if (!styleSheet) {
      styleSheet = document.createElement('style');
      styleSheet.id = id;
      document.head.appendChild(styleSheet);
    }

    styleSheet.textContent = content.replace(/\n/g, '');
  }

  useEffect(() => {
    const fetchStatusPage = async () => {
      try {
        const statusPages = await createGetRequest('/api/status', {
          statusPageId,
        });

        setStatusPage(statusPages?.data);
      } catch (error) {
        console.log(error);
        navigate('/error');
      }
    };

    fetchStatusPage();
  }, [statusPageId, navigate]);

  useEffect(() => {
    const styles = [
      `--status-font: ${font}`,
      `--status-theme: ${theme}`,
      `--status-header-background: ${headerBackground}`,
      `--status-background: ${background}`,
      `--status-text-color: ${textColor}`,
      `--status-highlight-color: ${highlight}`,
    ].join(';');

    injectStylesheet('status-configure-layout', `:root {${styles}}`);
  }, [
    statusPageId,
    font,
    theme,
    headerBackground,
    background,
    textColor,
    highlight,
  ]);

  if (!statusPage || !layout.length) {
    return null;
  }

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      <div className="status-page-content">
        {layout.map((item: any) => {
          switch (item.type) {
            case 'header': {
              return (
                <StatusPageHeader
                  key={item.id}
                  title={item.title}
                  status={item.status}
                  homepageUrl={homepageUrl}
                  logo={logo}
                  titleText={titleText}
                  lastUpdated={statusPage.lastUpdated}
                />
              );
            }
            case 'status': {
              const incident = statusPage.incidents[0] || {};
              const incidentStatus = getOverallStatus(
                incident,
                Object.values(statusPage.monitors)
              );

              const incidentsComponentExists = layout.find(
                (item) => item.type === 'incidents'
              );

              if (
                incidentsComponentExists &&
                incidentsComponentExists?.design !== 'Minimal' &&
                incident.status !== 'Resolved'
              ) {
                return null;
              }

              return (
                <StatusPageStatus
                  key={item.id}
                  icon={item.icon}
                  design={item.design}
                  size={item.size}
                  status={incidentStatus}
                  titleSize={item.titleSize}
                />
              );
            }
            case 'incidents': {
              const incident = statusPage.incidents[0] || null;

              if (!incident || incident.status === 'Resolved') return null;

              return (
                <StatusPageIncident
                  key={item.id}
                  incidents={incident.messages}
                  design={item.design}
                  status={incident.affect}
                  size={item.size}
                  titleSize={item.titleSize}
                  title={incident.title}
                />
              );
            }
            case 'uptime': {
              const monitors = item.autoAdd
                ? Object.keys(statusPage.monitors)
                : item.monitors;

              const allMonitors = monitors
                .map((monitorId) => {
                  const monitor = statusPage?.monitors[monitorId];
                  if (!monitor || monitor.paused) return null;

                  const monitorIncident = statusPage.incidents.find(
                    (incident) => incident?.monitorIds?.includes(monitorId)
                  );

                  const status = getMonitorStatus(monitorIncident, monitor);

                  return { ...monitor, status };
                })
                .filter(Boolean);

              return (
                <StatusPageUptime
                  key={item.id}
                  monitors={allMonitors}
                  graphType={item.graphType}
                  statusIndicator={item.statusIndicator}
                  title={item.title}
                  incidents={statusPage.incidents}
                />
              );
            }
            case 'metrics': {
              const monitors = item.autoAdd
                ? Object.keys(statusPage.monitors)
                : item.monitors.map((m) => m.id);

              const allMonitors = monitors
                .map((monitorId) => {
                  const monitor = statusPage?.monitors[monitorId];
                  if (!monitor || monitor.paused) return null;
                  return monitor;
                })
                .filter(Boolean);

              return (
                <StatusPageMetrics
                  key={item.id}
                  monitors={allMonitors}
                  title={item.title}
                  graphType={item.graphType}
                  showPing={item.data.showPing}
                  showName={item.data.showName}
                  heartbeats={statusPage.heartbeats}
                />
              );
            }
            case 'history': {
              return (
                <StatusConfigureLayoutHistoryList
                  key={item.id}
                  incidents={statusPage.incidents}
                  size={15}
                />
              );
            }
            case 'customHTML':
              return (
                <div
                  key={item.id}
                  dangerouslySetInnerHTML={{ __html: item.content }}
                ></div>
              );
            case 'customCSS':
              injectStylesheet(item.id, item.content);
              return null;
          }
        })}

        <StatusFooter />
      </div>
    </div>
  );
};

StatusPage.displayName = 'StatusPage';

export default StatusPage;
