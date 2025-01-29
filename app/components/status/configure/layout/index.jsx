import './styles.scss';

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
  const { layout, createComponent, reorderBlocks } = useStatusContext();
  const {
    modalStore: { openModal, closeModal },
  } = useContextStore();

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
