import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';
import { Button, Modal } from '@lunalytics/ui';

// import local files
import MonitorPageInitial from './pages/initial';
import useMonitorForm from '../../../hooks/useMonitorForm';
import MonitorConfigureHttpModal from './configure/http';
import MonitorConfigureJsonQueryModal from './configure/json';
import MonitorConfigurePingModal from './configure/ping';
import MonitorConfigureTcpModal from './configure/tcp';

const MonitorConfigureModal = ({
  closeModal,
  monitor,
  handleMonitorSubmit,
  isEdit = false,
}) => {
  const { errors, inputs, handleActionButtons, handleInput } = useMonitorForm(
    monitor,
    isEdit,
    closeModal,
    handleMonitorSubmit
  );

  return (
    <Modal
      title={isEdit ? 'Edit Monitor' : 'Add Monitor'}
      actions={
        <>
          <Button
            color="red"
            variant="flat"
            onClick={handleActionButtons('Cancel')}
          >
            Cancel
          </Button>
          <Button
            color="green"
            variant="flat"
            onClick={handleActionButtons('Create')}
            id="monitor-create-button"
          >
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </>
      }
      size="xl"
    >
      <div className="monitor-configure-container">
        <MonitorPageInitial
          inputs={inputs}
          errors={errors}
          handleInput={handleInput}
          isEdit={isEdit}
        />

        {inputs.type === 'http' ? (
          <MonitorConfigureHttpModal
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />
        ) : null}
        {inputs.type === 'json' ? (
          <MonitorConfigureJsonQueryModal
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />
        ) : null}
        {inputs.type === 'ping' ? (
          <MonitorConfigurePingModal
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />
        ) : null}
        {inputs.type === 'tcp' ? (
          <MonitorConfigureTcpModal
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />
        ) : null}
      </div>
    </Modal>
  );
};

MonitorConfigureModal.displayName = 'MonitorConfigureModal';

MonitorConfigureModal.propTypes = {
  closeModal: PropTypes.func,
  handleMonitorSubmit: PropTypes.func,
  isEdit: PropTypes.bool,
  monitor: PropTypes.object,
};

export default MonitorConfigureModal;
