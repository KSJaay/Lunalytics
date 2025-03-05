// import dependencies
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// import local files
import StatusFooter from '../components/status/configure/preview/footer';
import StatusPageHeader from '../components/status/configure/preview/header';
import StatusPageStatus from '../components/status/configure/preview/status';
import StatusPageUptime from '../components/status/configure/preview/uptime';
import StatusPageIncident from '../components/status/configure/preview/incident';
import StatusPageMetrics from '../components/status/configure/preview/metrics';
import StatusConfigureLayoutHistoryList from '../components/status/configure/layout/history/list';
import { createGetRequest } from '../services/axios';
import PropTypes from 'prop-types';

const StatusPage = ({ id }) => {
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

  function injectStylesheet(id, content = '') {
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
      } catch (_error) {
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

  if (!layout.length) {
    return null;
  }

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      <div className="status-page-content">
        {layout.map((item) => {
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
                />
              );
            }
            case 'status': {
              return (
                <StatusPageStatus
                  key={item.id}
                  icon={item.icon}
                  design={item.design}
                  size={item.size}
                  status={item.status}
                  titleSize={item.titleSize}
                />
              );
            }
            case 'incidents': {
              return (
                <StatusPageIncident
                  key={item.id}
                  incidents={statusPage.incidents}
                  incidentsStatus={item.incidentsStatus[0]?.status}
                  design={item.design}
                  status={item.status}
                  size={item.size}
                  titleSize={item.titleSize}
                />
              );
            }
            case 'uptime': {
              const monitors = item.autoAdd
                ? Object.keys(statusPage.monitors)
                : item.monitors;

              const allMonitors = monitors.map((monitorId) => {
                const monitor = statusPage?.monitors[monitorId];
                if (!monitor) return null;
                return { ...monitor, status: item.status };
              });

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
                ? Object.values(statusPage.monitors)
                : item.monitors;

              return (
                <StatusPageMetrics
                  key={item.id}
                  monitors={monitors}
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
                <StatusConfigureLayoutHistoryList key={item.id} size={15} />
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

StatusPage.propTypes = {
  id: PropTypes.string,
};

export default StatusPage;
