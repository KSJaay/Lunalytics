import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';

// import local files
import Modal from '../../ui/modal';
import MonitorPageInitial from './pages/initial';
import MonitorPageHttp from './pages/http';
import MonitorPageTcp from './pages/tcp';
import MonitorPageInterval from './pages/interval';
import useMonitorForm from '../../../hooks/useMonitorForm';

const MonitorConfigureModal = ({
  closeModal,
  monitor,
  handleMonitorSubmit,
  isEdit = false,
}) => {
  const { form, errors, inputs, handleActionButtons, handleInput } =
    useMonitorForm(monitor, isEdit, closeModal, handleMonitorSubmit);

  return (
    <Modal.Container closeButton={closeModal}>
      <Modal.Title style={{ textAlign: 'center' }}>
        {isEdit ? 'Edit Monitor' : 'Add Monitor'}
      </Modal.Title>
      <Modal.Message>
        {form.name === 'initial' && (
          <MonitorPageInitial
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
            isEdit={isEdit}
          />
        )}

        {form.name === 'http' && (
          <MonitorPageHttp
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />
        )}

        {form.name === 'tcp' && (
          <MonitorPageTcp
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />
        )}

        {form.name === 'interval' && (
          <MonitorPageInterval
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />
        )}
      </Modal.Message>

      <Modal.Actions>
        {form.actions.map((action) => (
          <Modal.Button key={action} onClick={handleActionButtons(action)}>
            {action}
          </Modal.Button>
        ))}
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
