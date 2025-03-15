import './styles.scss';

// import dependencies
import { useEffect } from 'react';

// import local files
import useStatusContext from '../../../../hooks/useConfigureStatus';
import Button from '../../../ui/button';
import StatusConfigureLayoutHeader from './header';
import StatusConfigureLayoutStatus from './status';
import StatusConfigureLayoutUptime from './uptime';
import StatusConfigureLayoutMetrics from './metrics';
import StatusConfigureLayoutHistory from './history';
import StatusConfigureLayoutIncidents from './incidents';
import StatusConfigureLayoutCustomHTML from './customHTML';
import StatusConfigureLayoutCustomCSS from './customCSS';
import useContextStore from '../../../../context';
import StatusConfigureAddModal from '../../../modal/status/configure/add';
import StatusConfigureReorderModal from '../../../modal/status/configure/reorder';

const StatusConfigureLayout = () => {
  const {
    settings: {
      font = 'Montserrat',
      theme = 'Auto',
      headerBackground = '#171a1c',
      background = '#171a1c',
      textColor = '#f3f6fb',
      highlight = '#17c964',
    },
    layout,
    createComponent,
    reorderBlocks,
  } = useStatusContext();
  const {
    modalStore: { openModal, closeModal },
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
  }, [font, theme, headerBackground, background, textColor, highlight]);

  return (
    <>
      {layout.map((item) => {
        switch (item.type) {
          case 'header':
            return (
              <StatusConfigureLayoutHeader
                key={item.id}
                componentId={item.id}
              />
            );
          case 'status':
            return (
              <StatusConfigureLayoutStatus
                key={item.id}
                componentId={item.id}
              />
            );
          case 'incidents':
            return (
              <StatusConfigureLayoutIncidents
                key={item.id}
                componentId={item.id}
              />
            );
          case 'uptime':
            return (
              <StatusConfigureLayoutUptime
                key={item.id}
                componentId={item.id}
              />
            );
          case 'metrics':
            return (
              <StatusConfigureLayoutMetrics
                key={item.id}
                componentId={item.id}
              />
            );
          case 'history':
            return (
              <StatusConfigureLayoutHistory
                key={item.id}
                componentId={item.id}
              />
            );
          case 'customHTML':
            return (
              <StatusConfigureLayoutCustomHTML
                key={item.id}
                componentId={item.id}
              />
            );
          case 'customCSS':
            return (
              <StatusConfigureLayoutCustomCSS
                key={item.id}
                componentId={item.id}
              />
            );
        }
      })}

      <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
        <Button
          fullWidth
          color="gray"
          onClick={() => {
            openModal(
              <StatusConfigureReorderModal
                layout={layout}
                closeModal={closeModal}
                reorderBlocks={reorderBlocks}
              />
            );
          }}
        >
          Reorder Blocks
        </Button>

        <Button
          fullWidth
          outline="primary"
          onClick={() => {
            openModal(
              <StatusConfigureAddModal
                closeModal={closeModal}
                createComponent={createComponent}
              />
            );
          }}
        >
          Add New Block
        </Button>
      </div>
    </>
  );
};

StatusConfigureLayout.displayName = 'StatusConfigureLayout';

StatusConfigureLayout.propTypes = {};

export default StatusConfigureLayout;
