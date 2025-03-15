import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

// import local files
import useContextStore from '../../../../context';
import useDropdown from '../../../../hooks/useDropdown';
import Dropdown from '../../../ui/dropdown';
import StatusConfigureMonitorItem from './item';
import Button from '../../../ui/button';

const StatusConfigureMonitor = ({
  componentId,
  getValues,
  updateAutoAdd,
  addSelectedMonitor,
  addAllMonitors,
  removeMonitor,
}) => {
  const {
    globalStore: { allMonitors, getMonitor },
  } = useContextStore();
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  const { autoAdd, monitors } = getValues(componentId);

  const dropdownOptions = allMonitors.filter((monitor) => {
    return !monitors.includes(monitor.monitorId);
  });

  return (
    <div className="scm-container">
      <div className="input-label">Monitors</div>
      <div className="input-short-description" style={{ marginTop: '-12px' }}>
        Select monitors to display on the status block.
      </div>
      {!autoAdd && dropdownOptions.length > 0 && (
        <Dropdown.Container
          toggleDropdown={toggleDropdown}
          isOpen={dropdownIsOpen}
        >
          <Dropdown.Trigger
            asInput
            toggleDropdown={toggleDropdown}
            isOpen={dropdownIsOpen}
          >
            Select a monitor
          </Dropdown.Trigger>

          <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
            {dropdownOptions.map((monitor) => (
              <Dropdown.Item
                key={monitor.monitorId}
                onClick={() => {
                  addSelectedMonitor(monitor.monitorId);
                  toggleDropdown();
                }}
              >
                {monitor.name}
              </Dropdown.Item>
            ))}
          </Dropdown.List>
        </Dropdown.Container>
      )}

      {!autoAdd && monitors.length > 0 ? (
        <div style={{ marginTop: '12px' }}>
          {monitors.map((monitorId) => (
            <StatusConfigureMonitorItem
              key={monitorId}
              monitor={getMonitor(monitorId)}
              removeMonitor={removeMonitor}
            />
          ))}
        </div>
      ) : null}

      {monitors.length === 0 && !autoAdd ? (
        <div className="scmo-container">
          <div className="scmo-title">
            Select monitors to display on the status page.
          </div>
          <div className="scmo-buttons">
            <Button color="green" onClick={addAllMonitors}>
              Add all monitors
            </Button>
            <Button color="green" onClick={() => updateAutoAdd(true)}>
              Auto add monitors
            </Button>
          </div>
        </div>
      ) : null}

      {autoAdd ? (
        <div className="scmaa-container">
          <div className="scmaa-content">
            <div className="scmaa-title">Auto add montiors</div>
            <div className="scmaa-subtitle">
              All monitors will be visible on this page. As you create more
              monitors they will be added to this page. You can disable auto add
              to manually select specific monitors.
              <br />
              When using auto add, metric graphs will use the basic style.
            </div>
          </div>
          <div>
            <Button onClick={() => updateAutoAdd(false)}>
              Disable auto add
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

StatusConfigureMonitor.displayName = 'StatusConfigureMonitor';

StatusConfigureMonitor.propTypes = {
  componentId: PropTypes.string.isRequired,
  getValues: PropTypes.func.isRequired,
  updateAutoAdd: PropTypes.func.isRequired,
  addSelectedMonitor: PropTypes.func.isRequired,
  addAllMonitors: PropTypes.func.isRequired,
  removeMonitor: PropTypes.func.isRequired,
};

export default observer(StatusConfigureMonitor);
