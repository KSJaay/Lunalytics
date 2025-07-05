import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';

// import local files
import Modal from '../../ui/modal';
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
    <Modal.Container closeButton={closeModal}>
      <Modal.Title style={{ textAlign: 'center' }}>
        {isEdit ? 'Edit Monitor' : 'Add Monitor'}
      </Modal.Title>
      <Modal.Message>
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
      </Modal.Message>

      <Modal.Actions>
        <Modal.Button onClick={handleActionButtons('Cancel')}>
          Cancel
        </Modal.Button>
        <Modal.Button
          onClick={handleActionButtons('Create')}
          color="green"
          id="monitor-create-button"
        >
          {isEdit ? 'Update' : 'Create'}
        </Modal.Button>
      </Modal.Actions>
    </Modal.Container>
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
