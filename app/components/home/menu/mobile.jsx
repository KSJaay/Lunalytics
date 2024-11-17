// import dependencies
import PropTypes from 'prop-types';
import { FaCog, FaPlus } from 'react-icons/fa';
import { observer } from 'mobx-react-lite';

// import local files
import useContextStore from '../../../context';
import Modal from '../../ui/modal';
import Button from '../../ui/button';
import HomeMobileMenuStatus from './mobile/status';
import HomeMobileMenuLayout from './mobile/layout';
import MonitorConfigureModal from '../../modal/monitor/configure';

const HomeMenuMobile = ({ handleReset }) => {
  const {
    modalStore: { openModal, closeModal },
    globalStore: { addMonitor },
  } = useContextStore();

  return (
    <Button
      iconLeft={<FaCog style={{ width: '30px', height: '30px' }} />}
      onClick={() => {
        openModal(
          <Modal.Container>
            <Modal.Title>Settings</Modal.Title>
            <Modal.Message>
              <div className="input-label">Status</div>
              <HomeMobileMenuStatus />
              <div className="input-label">Layout</div>
              <HomeMobileMenuLayout />
              <br />
              <Button
                iconLeft={<FaPlus style={{ width: '20px', height: '20px' }} />}
                color={'gray'}
                fullWidth
                onClick={() => {
                  closeModal();
                  openModal(
                    <MonitorConfigureModal
                      closeModal={closeModal}
                      handleMonitorSubmit={addMonitor}
                    />,
                    false
                  );
                }}
              >
                New Monitor
              </Button>
            </Modal.Message>
            <Modal.Actions>
              <Modal.Button onClick={closeModal}>Close</Modal.Button>
              <Modal.Button
                color="red"
                onClick={() => {
                  handleReset();
                  closeModal();
                }}
              >
                Reset
              </Modal.Button>
            </Modal.Actions>
          </Modal.Container>,
          false
        );
      }}
    />
  );
};

HomeMenuMobile.displayName = 'HomeMenuMobile';

HomeMenuMobile.propTypes = {
  handleReset: PropTypes.func.isRequired,
};

export default observer(HomeMenuMobile);
