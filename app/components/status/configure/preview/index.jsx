import './styles.scss';

// import dependencies
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

// import local files
import useStatusContext from '../../../../hooks/useConfigureStatus';
import StatusPageHeader from './header';
import StatusPageStatus from './status';
import StatusPageUptime from './uptime';
import StatusPageMetrics from './metrics';
import StatusPageIncident from './incident';
import useContextStore from '../../../../context';
import { defaultIncidents } from '../../../../constant/status';
import StatusConfigureLayoutHistoryList from '../layout/history/list';
import StatusFooter from './footer';

const StatusConfigurePreview = () => {
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
    },
    layout,
    getComponent,
  } = useStatusContext();

  const {
    globalStore: { allMonitors, getMonitor },
  } = useContextStore();

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
    const styles = [
      `--status-font: ${font}`,
      `--status-theme: ${theme}`,
      `--status-header-background: ${headerBackground}`,
      `--status-background: ${background}`,
      `--status-text-color: ${textColor}`,
      `--status-highlight-color: ${highlight}`,
    ].join(';');

    injectStylesheet('status-configure-layout', `:root {${styles}}`);

    const statusPreviewContainer = document.getElementById(
      'status-configure-account-container'
    );

    if (statusPreviewContainer) {
      statusPreviewContainer.scrollTo(0, 0, { behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      {layout.map((item) => {
        switch (item.type) {
          case 'header': {
            const component = getComponent(item.id);

            return (
              <StatusPageHeader
                key={item.id}
                title={component.title}
                status={component.status}
                homepageUrl={homepageUrl}
                logo={logo}
                titleText={titleText}
              />
            );
          }
          case 'status': {
            const component = getComponent(item.id);

            return (
              <StatusPageStatus
                key={item.id}
                icon={component.icon}
                design={component.design}
                size={component.size}
                status={component.status}
                titleSize={component.titleSize}
              />
            );
          }
          case 'incidents': {
            const component = getComponent(item.id);

            return (
              <StatusPageIncident
                key={item.id}
                incidents={defaultIncidents}
                incidentsStatus={component.incidentsStatus}
                design={component.design}
                status={component.status}
                size={component.size}
                titleSize={component.titleSize}
              />
            );
          }
          case 'uptime': {
            const component = getComponent(item.id);

            const allMonitors = component.monitors.map((monitorId) => {
              const monitor = getMonitor(monitorId);
              if (!monitor) return null;
              return { ...monitor, status: component.status };
            });

            return (
              <StatusPageUptime
                key={item.id}
                monitors={allMonitors}
                graphType={component.graphType}
                statusIndicator={component.statusIndicator}
                title={component.title}
              />
            );
          }
          case 'metrics': {
            const component = getComponent(item.id);

            const monitorList = component.autoAdd
              ? allMonitors.map((monitor) => ({
                  id: monitor.monitorId,
                  title: monitor.name,
                  graphType: 'Basic',
                  showPing: component.data.showPing,
                }))
              : component.monitors;

            return (
              <StatusPageMetrics
                key={item.id}
                monitors={monitorList}
                title={component.title}
                graphType={component.graphType}
                showPing={component.data.showPing}
                showName={component.data.showName}
              />
            );
          }
          case 'history': {
            return <StatusConfigureLayoutHistoryList key={item.id} size={15} />;
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
    </>
  );
};

StatusConfigurePreview.displayName = 'StatusConfigurePreview';

StatusConfigurePreview.propTypes = {};

export default observer(StatusConfigurePreview);
