import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';

// import local files
import Modal from '../../ui/modal';
import MonitorPageInitial from './pages/initial';
import MonitorPageHttp from './pages/http';
import MonitorPageTcp from './pages/tcp';
import MonitorPageInterval from './pages/interval';
import MonitorPageNotification from './pages/notification';
import useMonitorForm from '../../../hooks/useMonitorForm';
import { Accordion, AccordionItem } from '../../ui/accordion';
import MonitorHttpStatusCodes from './pages/http/statusCodes';
import MonitorHttpHeaders from './pages/headers';
import MonitorHttpBody from './pages/body';

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
            <MonitorPageHttp
              inputs={inputs}
              errors={errors}
              handleInput={handleInput}
            />
          ) : null}

          {inputs.type === 'tcp' ? (
            <MonitorPageTcp
              inputs={inputs}
              errors={errors}
              handleInput={handleInput}
            />
          ) : null}
          <br />
          <Accordion dark>
            <AccordionItem
              title="Advanced Settings"
              subtitle={
                'Setup advanced settings for the monitor, such as intervals, notifications, and others.'
              }
              value="Advance"
              id="monitor-advanced-settings"
            >
              <MonitorPageNotification
                inputs={inputs}
                errors={errors}
                handleInput={handleInput}
              />

              <MonitorHttpStatusCodes
                selectedIds={inputs.valid_status_codes}
                handleStatusCodeSelect={(code) => {
                  const { valid_status_codes = [] } = inputs;
                  const validStatusCodes = valid_status_codes.includes(code)
                    ? valid_status_codes.filter((id) => id !== code)
                    : valid_status_codes.concat(code);
                  handleInput('valid_status_codes', validStatusCodes);
                }}
              />

              {errors.valid_status_codes && (
                <label className="input-error">
                  {errors.valid_status_codes}
                </label>
              )}

              <MonitorPageInterval
                inputs={inputs}
                errors={errors}
                handleInput={handleInput}
              />

              {inputs.type === 'http' ? (
                <>
                  <MonitorHttpHeaders
                    inputs={inputs}
                    errors={errors}
                    handleInput={handleInput}
                  />

                  <MonitorHttpBody
                    inputs={inputs}
                    errors={errors}
                    handleInput={handleInput}
                  />
                </>
              ) : null}

              <br />
            </AccordionItem>
          </Accordion>
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
